class ReviewsController < ApplicationController

  def new
    @place = Place.find(params[:place_id])
    @reviews = Review.all
    @review = Review.new # needed to instantiate the form_for
  end

  def create
    @place = Place.find(params[:place_id])
    @review = Review.new(review_params)
    @review.place = @place
    @review = @place.reviews.build(review_params)
    @review.user = current_user

    if @review.save
      redirect_to place_path(@place), notice: 'Review was successfully created.'
    else
      render :new, alert: 'Review could not be created. Please check the form and try again.'
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

  private

  def review_params
    params.require(:review).permit(:place_id, :image, :comment, :rating)
  end
end
