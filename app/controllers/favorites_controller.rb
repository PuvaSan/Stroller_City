class FavoritesController < ApplicationController
  def index
    @reviews = Review.all
  end
end
