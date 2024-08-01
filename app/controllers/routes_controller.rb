class RoutesController < ApplicationController
  def index
  end

  def show
  @route = Route.find(params[:id])
    @route_coordinates = @route.trips.flat_map do |trip|
      trip.details.map do |detail|
        [detail.latitude, detail.longitude]
      end
    end
  end

  def create
  end

  def update
  end

  def destroy
  end
end
