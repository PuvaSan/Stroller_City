require 'open-uri'

class PlacesController < ApplicationController
  def index
    @places = Place.all
  end

  def show
    @place = Place.find(params[:id])
  end

  def create
    place_instantiator(params[:placeId])
    # tags = params.each_key.select { |key| params[key] == "on"}
    tags = params[:tags] || []
    new_place = Place.last
    tags.each do |tag|
      new_place.sc_facility_list.add(tag)
    end
    new_place.save

    render json: { status: "success", id: new_place.id }
  end

  def update
    place = Place.find(params[:placeId])
    tags = params[:tags] || []
    place.sc_facility_list.clear
    tags.each do |tag|
      place.sc_facility_list.add(tag)
    end
    place.save
    render json: { status: "success", id: place.id }
  end

  def destroy
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
