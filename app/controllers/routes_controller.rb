require "google/cloud/translate"
require 'open-uri'
require 'nokogiri'
require 'erb'

class RoutesController < ApplicationController
  before_action :set_route_params, only: [:index]
  before_action :set_origin_destination, only: [:index, :show]

  # share translate method with the view
  helper_method :translate

  def translate(text)
    api_key = ENV['GOOGLE_MAPS_API_KEY']
    translate_url = "https://translation.googleapis.com/language/translate/v2"

    response = Faraday.get(translate_url, {
      q: text,
      source: 'ja',
      target: 'en',
      key: api_key
    })

    json_response = JSON.parse(response.body)
    translated_text = json_response['data']['translations'].first['translatedText']
    translated_text
  rescue StandardError => e
    Rails.logger.error("Translation API error: #{e.message}")
    text # Return the original text if there's an error
  end

  def index
    @navitime_routes = fetch_navitime_routes(session[:start_lat], session[:start_long], session[:end_lat], session[:end_long])

    if @navitime_routes
      # Initialize variables to store the best route characteristics
      quickest_route = shortest_route = less_walking_route = cheapest_route = nil

      @navitime_routes['items'].each do |route|
        route_time = route['summary']&.dig('move', 'time') || Float::INFINITY
        route_distance = route['summary']&.dig('move', 'distance') || Float::INFINITY
        route_walk_distance = route['summary']&.dig('move', 'walk_distance') || Float::INFINITY
        route_fare = route['summary']&.dig('move', 'fare', 'unit_0') || Float::INFINITY

        # Find the quickest route
        quickest_route = route if quickest_route.nil? || route_time < quickest_route['summary']['move']['time']

        # Find the shortest route
        shortest_route = route if shortest_route.nil? || route_distance < shortest_route['summary']['move']['distance']

        # Find the route with less walking
        less_walking_route = route if less_walking_route.nil? || route_walk_distance < less_walking_route['summary']['move']['walk_distance']

        # Find the cheapest route
        cheapest_route = route if cheapest_route.nil? || route_fare < cheapest_route['summary']['move']['fare']['unit_0']
      end
      # Set instance variables for use in the view
      @quickest_route = quickest_route
      @shortest_route = shortest_route
      @less_walking_route = less_walking_route
      @cheapest_route = cheapest_route
    end
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
    end

    # number of transport stops array
    # Assuming @route is already set and contains the necessary data
    @stops = []
    last_departure_number = nil

    @stops = []
    numbering_pairs = {}

    @route['sections'].each do |section|
      if section['numbering'].present?
        section['numbering'].each do |key, value|
          value.each do |numbering|
            symbol = numbering['symbol']
            number = numbering['number'].to_i

            # If we already have a stored number for this symbol, calculate the difference
            if numbering_pairs[symbol]
              difference = (numbering_pairs[symbol] - number).abs
              @stops << difference

              # After using the pair, reset the stored value to the current number
              numbering_pairs[symbol] = number
            else
              # Otherwise, store this number for future comparison
              numbering_pairs[symbol] = number
            end
          end
        end
      end
    end

    puts "!!stops: #{@stops}"

    @station_images = []
    @route['sections'].each_with_index do |section, index|
      station_name = translate(section['name'])
      if station_name.include?("3-chome")
        station_name.gsub!("3-chome", "sanchome")
      end
      station_name.gsub!(" ", "-")
      if section['node_id'].present? && section['gateway'].nil?
        url = "https://www.tokyometro.jp/station/yardmap_img/figure_yardmap_#{station_name.downcase}_all.jpg"

        begin
        document = Nokogiri::HTML.parse(URI.open(url).read)
        unless document.search("h1").present?
          @station_images << {index: index, url: url}
        end
        rescue OpenURI::HTTPError => e
          Rails.logger.error("Error fetching station image: #{e.message}")
        end
      end
      if section['gateway'].present?
        place = Place.where("name ILIKE ?", "%#{station_name} Station%").first
        if place
          @station_images << {index: index, place: place}
        end
      end
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
