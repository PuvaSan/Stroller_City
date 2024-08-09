class PagesController < ApplicationController
  protect_from_forgery with: :null_session

  def home
    @place_name = params[:place_name]
    @place = Place.find_by(name: @place_name) if @place_name.present?

    # Handle the initial page load
    render :home
  end

  def receive_place_name
    place_name = params[:place_name]
    @place = Place.where("name ILIKE ?", "%#{place_name}%").first

    if @place
      render json: { status: "success", place_name: @place.name }
    else
      render json: { status: "error", message: "Place not found in DB" }, status: :not_found
    end
  end
end
