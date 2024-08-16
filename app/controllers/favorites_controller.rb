class FavoritesController < ApplicationController
  before_action :authenticate_user!
  def index
    @reviews = Review.all
    @review = Review.new
  end

  def my_list
    @reviews = current_user.reviews.includes(:place) # Assuming each review belongs to a user and a place
  end

  def create
    @review = Review.new(review_params)
    # @review = @place.reviews.build(review_params)
    @review.user = current_user

    if @review.save
      redirect_to favorites_path, notice: 'Review was successfully created.'
    else
      render :index, alert: 'Review could not be created. Please check the form and try again.'
    end
  end

  private

  def review_params
    params.require(:review).permit(:place, :photos, :comment, :rating)
  end

end
