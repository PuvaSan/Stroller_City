class PagesController < ApplicationController
  protect_from_forgery with: :null_session

  def home
    @google_maps_api_key = ENV['GOOGLE_MAPS_API_KEY']

    puts "Debugging Google api Key: #{@google_maps_api_key}"

    @place = Place.find_by(params[:id]) if params[:id].present?
    @places = Place.all
    # @place = Place.find_by(name: @place_name) if @place_name.present?
    @reviews = Review.all
    @review = Review.new
    # Handle the initial page load
    @top_places = Place
      .joins(:reviews)
      .select('places.*, AVG(reviews.rating) AS average_rating')
      .group('places.id')
      .order('average_rating DESC')
      .limit(5)
    render :home
  end

  def receive_place_name
    place_name = params[:place_name]
    @place = Place.where("name ILIKE ?", "%#{place_name}%").first

    if @place && @place.reviews.any?
      place_ratings = @place.reviews.average(:rating).to_f
    else
      place_ratings = 0
    end

    if @place
      render json: { status: "success", id: @place.id, place_ratings: place_ratings, place_name: @place.name }
    else
      render json: { status: "error", message: "Place not found in DB" }, status: :not_found
    end
  end

  def render_reviews
    @place = Place.find(params[:id]) # Find the place by ID

    if @place
      render partial: 'shared/review_card', locals: { place: @place }
    else
      render plain: "No reviews found", status: :not_found
    end
  end

  def render_tags
    @place = Place.find(params[:id])
    if @place
      render partial: 'shared/tag_card', locals: { place: @place }
    else
      render plain: "No tags found", status: :not_found
    end
  end

end
