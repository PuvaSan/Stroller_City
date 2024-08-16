class RoutesController < ApplicationController
  before_action :set_route_params, only: [:index]
  before_action :set_origin_destination, only: [:index, :show]

  def index
    @navitime_routes = fetch_navitime_routes(session[:start_lat], session[:start_long], session[:end_lat], session[:end_long])
  end

  def show
    route_no = params[:id]

    # Make a new API call using the same parameters in saved sessions
    navitime_routes = fetch_navitime_routes(session[:start_lat], session[:start_long], session[:end_lat], session[:end_long])

    @route = navitime_routes['items'].find { |r| r['summary']['no'] == route_no }

    Rails.logger.error(@route)

    if @route.nil?
      redirect_to routes_path, alert: "Route not found."
    else
      @sections = @route['sections']
      @first_point_section = @sections.find { |s| s['type'] == 'point' && s['name'] == 'start' }
    @last_point_section = @sections.reverse.find { |s| s['type'] == 'point' && s['name'] == 'goal' }
    end
  end

  private

  def set_origin_destination
    @origin = session[:origin]
    @destination = session[:destination]
  end

  def set_route_params
    session[:start_lat] = params[:start_lat]
    session[:start_long] = params[:start_long]
    session[:end_lat] = params[:end_lat]
    session[:end_long] = params[:end_long]
    session[:origin] = params[:origin]
    session[:destination] = params[:destination]
  end

  def fetch_navitime_routes(start_lat, start_long, end_lat, end_long)
    datum = "wgs84"
    term = 1440
    limit = 5
    start_time = "2020-08-19T10:00:00"
    coord_unit = "degree"
    walk_route = "babycar"
    shape = true

    url = URI("https://navitime-route-totalnavi.p.rapidapi.com/route_transit?" +
      "start=#{start_lat}%2C#{start_long}&" +
      "goal=#{end_lat}%2C#{end_long}&" +
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
