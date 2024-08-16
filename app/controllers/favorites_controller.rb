class FavoritesController < ApplicationController
  before_action :authenticate_user!
  def index
    @reviews = Review.all
    @review = Review.new
  end

  def my_list
    @reviews = current_user.reviews.includes(:place) # Assuming each review belongs to a user and a place
  end

end
