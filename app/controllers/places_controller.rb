class PlacesController < ApplicationController
  def index
  end

  def show
    @place = Place.find(params[:id])
  end

  def create
  end

  def update
  end

  def destroy
  end
end
