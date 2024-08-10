class RoutesController < ApplicationController
  def show
    @route = Route.find(params[:id])
    @route_coordinates = @route.details.map do |detail|
      { lat: detail.latitude, lng: detail.longitude, info: detail.title }
    end
    @route_coordinates.reject! { |coord| coord[:lat].nil? || coord[:lng].nil? }
    logger.debug "Filtered Route Coordinates: #{@route_coordinates.to_json}" # Add this line for debugging
  rescue ActiveRecord::RecordNotFound
    flash[:alert] = "Route not found."
    redirect_to routes_path
  rescue NoMethodError => e
    logger.error "No method error in RoutesController#show: #{e.message}"
    flash[:alert] = "An error occurred while fetching route details."
    redirect_to routes_path
  end

  def index
    @routes = Route.all
  end
end
