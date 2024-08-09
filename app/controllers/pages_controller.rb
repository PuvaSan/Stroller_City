class PagesController < ApplicationController
  protect_from_forgery with: :null_session

  def home
    @place = Place.find_by(params[:id]) if params[:id].present?
    # @place = Place.find_by(name: @place_name) if @place_name.present?

    # Handle the initial page load
    render :home
  end

  def receive_place_name
    place_name = params[:place_name]
    @place = Place.where("name ILIKE ?", "%#{place_name}%").first

    if @place
      render json: { status: "success", id: @place.id, place_name: @place.name }
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

end
