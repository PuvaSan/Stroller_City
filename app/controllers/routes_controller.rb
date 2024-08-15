class RoutesController < ApplicationController
  def index
    @start_lat = params[:start_lat]
    @start_long = params[:start_long]
    @end_lat = params[:end_lat]
    @end_long = params[:end_long]

    # You can pass these as parameters or get them from the user input
    start_lat = 35.66897912700963
    start_lon = 139.78638732593615
    goal_lat = 35.63402959100441
    goal_lon = 139.70818573942807
    datum = "wgs84"
    term = 1440
    limit = 5
    start_time = "2020-08-19T10:00:00"
    coord_unit = "degree"
    walk_route = "babycar"
    shape = true

    @navitime_routes = fetch_navitime_routes(start_lat, start_lon, goal_lat, goal_lon, datum, term, limit, start_time, coord_unit, walk_route, shape)

    if @navitime_routes && @navitime_routes['items'].present?
      Rails.cache.write("navitime_routes", @navitime_routes) # Store the routes in the cache
    else
      flash[:alert] = "No routes found or API request failed."
    end

    Rails.logger.info("Cached Routes: #{Rails.cache.read('navitime_routes')}")

  end

  def show
    # Retrieve the routes data from the cache
    @route = Rails.cache.read("navitime_routes")

    # navitime_routes = Rails.cache.read("navitime_routes")
    # route_no = params[:id].to_i # Assuming route number is passed as an ID parameter
    # @route = navitime_routes['items'].find { |route| route['summary']['no'] == route_no }



    # if navitime_routes.present?
    #   route_no = params[:id]
    #   @route = navitime_routes['items'].find { |route| route['summary']['no'] == route_no }

    #   if @route.nil?
    #     redirect_to routes_path, alert: "Route not found."
    #   end
    # else
    #   redirect_to routes_path, alert: "No route data available. Please search for routes first."
    # end
  end

  private

  def fetch_navitime_routes(start_lat, start_lon, goal_lat, goal_lon, datum, term, limit, start_time, coord_unit, walk_route, shape)
    # Build the URL dynamically
    url = URI("https://navitime-route-totalnavi.p.rapidapi.com/route_transit?" +
      "start=#{start_lat}%2C#{start_lon}&" +
      "goal=#{goal_lat}%2C#{goal_lon}&" +
      "datum=#{datum}&" +
      "term=#{term}&" +
      "limit=#{limit}&" +
      "start_time=#{URI.encode_www_form_component(start_time)}&" +
      "coord_unit=#{coord_unit}&" +
      "walk_route=#{walk_route}&" +
      "shape=#{shape}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["x-rapidapi-key"] = ENV['RAPIDAPI_KEY']
    request["x-rapidapi-host"] = 'navitime-route-totalnavi.p.rapidapi.com'

    response = http.request(request)

    if response.code == "200"
      JSON.parse(response.body)
    else
      Rails.logger.error("Navitime API request failed: #{response.body}")
      nil
    end
  rescue StandardError => e
    Rails.logger.error("Error fetching Navitime routes: #{e.message}")
    nil
  end
end
