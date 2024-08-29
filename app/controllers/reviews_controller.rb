require 'open-uri'

class ReviewsController < ApplicationController

  def new
    @place = Place.find(params[:place_id])
    @reviews = Review.all
    @review = Review.new # needed to instantiate the form_for
  end

  def create
    if user_signed_in?
      place = Place.find_or_initialize_by(id: params[:review][:place_id])
      debugger
      if place.new_record?
        place_instantiator(params[:review][:place_id])
        place = Place.last
      end

      review = Review.new(
        place: place,
        user: current_user,
        rating: params[:review][:rating],
        comment: params[:review][:comment]
      )

      if review.save
        if params[:review][:photos].present?
          review.photos.attach(params[:review][:photos])
          place.photos.attach(params[:review][:photos])
        end
        render json: { status: "success", id: place.id }
      else
        render json: { status: "error", message: review.errors.full_messages.join(", ") }, status: review.errors.full_messages.join(", ")
      end
    else
      render json: { status: "error", message: "You must be signed in to leave a review." }, status: :unauthorized
    end

  rescue => e
    render json: { status: "error", message: "An error occurred: #{e.message}" }, status: :internal_server_error
  end

  def end_reviews
    @places = params[:place_ids].split(',').select { |s| s != '' }.reverse!
  end

  def destroy
    review = Review.find(params[:id])
    review.destroy
    redirect_to root_path
  end

  private

  def place_instantiator(place_id)
    url = "https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cphoto%2Cformatted_address%2Cgeometry%2Cphoto&place_id=#{place_id}&key=#{ENV['GOOGLE_MAPS_API_KEY']}"
    fetch_place = URI.open(url).read
    place = JSON.parse(fetch_place)
    name = place["result"]["name"]
    address = place["result"]["formatted_address"]
    latitude = place["result"]["geometry"]["location"]["lat"]
    longitude = place["result"]["geometry"]["location"]["lng"]
    photo_reference = place["result"]["photos"][0]["photo_reference"]

    Place.create!(name: name, address: address, latitude: latitude, longitude: longitude, google_id: place_id)
    photourl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=#{photo_reference}&key=#{ENV['GOOGLE_MAPS_API_KEY']}"
    fetch_photo = URI.open(photourl)
    Place.last.photos.attach(io: fetch_photo, filename: "#{name}.jpg")
  end
end
