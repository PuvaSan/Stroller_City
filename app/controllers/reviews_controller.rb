class ReviewsController < ApplicationController

  def new
    @place = Place.find(params[:place_id])
    @review = Review.new  # needed to instantiate the form_for
  end

  def create
    @place = Place.find(params[:place_id])
    @review = Review.new(review_params)
    @review.place = @place

    if @review.save
      redirect_to place_path(@place)
    else
      redirect_to root_path
    end
  end

  private

  def review_params
    params.require(:review).permit(:comment, :rating)
  end
end
