class RoutesController < ApplicationController
  before_action :set_route_params, only: [:index, :show]

  def index
    @navitime_routes = fetch_navitime_routes
  end

  def show
    route_no = params[:id]

    # Make a new API call using the same parameters to fetch detailed information about the specific route
    navitime_routes = fetch_navitime_routes
    @route = navitime_routes['items'].find { |r| r['summary']['no'] == route_no }
    @sections = @route['sections']

  end

  private

  def set_route_params
    @start_lat = params[:start_lat] || 35.66897912700963
    @start_long = params[:start_long] || 139.78638732593615
    @end_lat = params[:end_lat] || 35.63402959100441
    @end_long = params[:end_long] || 139.70818573942807
  end

  def fetch_navitime_routes
    start_lat = @start_lat
    start_lon = @start_long
    goal_lat = @end_lat
    goal_lon = @end_long
    datum = "wgs84"
    term = 1440
    limit = 5
    start_time = "2020-08-19T10:00:00"
    coord_unit = "degree"
    walk_route = "babycar"
    shape = true

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

  def render_route_details(route)
    # Render or handle the route details here
    # Example: render json: route
  end
end
