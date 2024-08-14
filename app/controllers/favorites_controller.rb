class FavoritesController < ApplicationController
  def index
    @favorites = Favorite.all.includes(:reviews)
  end
end
