class PagesController < ApplicationController
  protect_from_forgery with: :null_session

  def home
    @place = Place.find_by(params[:id]) if params[:id].present?
    # @place = Place.find_by(name: @place_name) if @place_name.present?
    @reviews = Review.all
    @review = Review.new
    # Handle the initial page load
    @top_places = Place
        .select('places.address, COALESCE(AVG(reviews.rating), 0) AS average_rating')
        .left_joins(:reviews) # This performs a LEFT JOIN with the reviews table
        .group('places.id, places.name') # Group by place id and name
        .order('average_rating DESC') # Order by average rating in descending order
        .limit(5) # Limit the results to 5 places
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

  def like
    @review = Review.find(params[:id])
    @review.increment!(:likes_count)

    respond_to do |format|
      format.html { redirect_back(fallback_location: root_path) }
      format.json { render json: { likes_count: @review.likes_count } }
    end
  end

end
