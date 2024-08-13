class RoutesController < ApplicationController
  def index
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

    if @navitime_routes.nil? || @navitime_routes['items'].blank?
      flash[:alert] = "No routes found or API request failed."
    end
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
      "start_time=#{URI.encode_www_form_component(start_time)}&" + # Updated encoding
      "coord_unit=#{coord_unit}&" +
      "walk_route=#{walk_route}&" +
      "shape=#{shape}")

    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true

    request = Net::HTTP::Get.new(url)
    request["x-rapidapi-key"] = ENV['RAPIDAPI_KEY'] # Use your environment variable
    request["x-rapidapi-host"] = 'navitime-route-totalnavi.p.rapidapi.com'

    response = http.request(request)

    # Rails.logger.info("Navitime API Response Code: #{response.code}")
    # Rails.logger.info("Navitime API Response Body: #{response.body}")

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
