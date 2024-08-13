require 'rest-client'

class RoutesController < ApplicationController
  def index
    @routes = Route.all # Fetch all routes from the database
    @navitime_routes = fetch_navitime_routes # Fetch routes from Navitime API

    Rails.logger.debug "Navitime API Response: #{@navitime_routes.inspect}" # Debugging output
  end

  private

  def fetch_navitime_routes
    api_key = ENV['RAPIDAPI_KEY']
    begin
      response = RestClient.get('https://navitime-route-totalnavi.p.rapidapi.com/route_transit', {
        params: {
          start: '35.66897912700963,139.78638732593615',
          goal: '35.63402959100441,139.70818573942807',
          datum: 'wgs84',
          term: 1440,
          limit: 5,
          start_time: '2020-08-19T10:00:00',
          coord_unit: 'degree',
          walk_route: 'babycar',
          shape: true
        },
        headers: {
          'X-RapidAPI-Key' => api_key,
          'X-RapidAPI-Host' => 'navitime-route-totalnavi.p.rapidapi.com'
        }
      })

      parsed_response = JSON.parse(response.body)
      Rails.logger.debug "Parsed Navitime Response: #{parsed_response.inspect}" # Debugging output
      parsed_response
    rescue RestClient::ExceptionWithResponse => e
      Rails.logger.error "Navitime API request failed: #{e.response}"
      nil
    end
  end
end
