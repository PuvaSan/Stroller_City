class FavoritesController < ApplicationController
  def index
    @reviews = Review.all
    @review = Review.new
  end

end
