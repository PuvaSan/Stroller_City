# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require 'json'

# Update the path to the JSON file
file_path = Rails.root.join('db', 'seeds', 'directions.json')
file = File.read(file_path)
data = JSON.parse(file)

# Extract data from the JSON file and create records in the database

# Create places
data['places_info'].each do |place|
  Place.create!(
    address: place['address'],
    latitude: place['gps_coordinates']['latitude'],
    longitude: place['gps_coordinates']['longitude']
  )
end

# Create routes
data['directions'].each do |direction|
  route = Route.create!(
    start: Place.first,
    end: Place.last,
    start_time: direction['start_time'],
    end_time: direction['end_time'],
    distance: direction['distance'],
    duration: direction['duration'],
    formatted_distance: direction['formatted_distance'],
    formatted_duration: direction['formatted_duration'],
    cost: direction['cost'],
    currency: direction['currency']
  )

  # Create trips and details
  direction['trips'].each do |trip_data|
    trip = Trip.create!(
      route: route,
      travel_mode: trip_data['travel_mode'],
      title: trip_data['title'],
      distance: trip_data['distance'],
      duration: trip_data['duration'],
      formatted_distance: trip_data['formatted_distance'],
      formatted_duration: trip_data['formatted_duration'],
      start_stop_name: trip_data.dig('start_stop', 'name'),
      start_stop_id: trip_data.dig('start_stop', 'stop_id'),
      start_time: trip_data.dig('start_stop', 'time'),
      end_stop_name: trip_data.dig('end_stop', 'name'),
      end_stop_id: trip_data.dig('end_stop', 'stop_id'),
      end_time: trip_data.dig('end_stop', 'time'),
      service_name: trip_data.dig('service_run_by', 'name'),
      service_link: trip_data.dig('service_run_by', 'link')
    )

    # Only iterate over details if they exist
    if trip_data['details']
      trip_data['details'].each do |detail_data|
        Detail.create!(
          trip: trip,
          title: detail_data['title'],
          action: detail_data['action'],
          distance: detail_data['distance'],
          duration: detail_data['duration'],
          formatted_distance: detail_data['formatted_distance'],
          formatted_duration: detail_data['formatted_duration'],
          latitude: detail_data.dig('gps_coordinates', 'latitude'),
          longitude: detail_data.dig('gps_coordinates', 'longitude')
        )
      end
    end
  end
end

User.destroy_all
Review.destroy_all

User.create!(
  [
    { email: "brianisloco@hotmail.com", password: "123456", username: "brianUchiha" },
    { email: "Aya0123@gmail.com", password: "secret", username: "AyyyaSayonara" },
    { email: "Javierisdaman@gmail.com", password: "pieking101", username: "HabiOppaiKing" },
    { email: "IkumiOjiro2017@gmail.com", password: "mybirthday01", username: "SuperSaiyanIkumi" }
  ]
)
user1 = User.find_by(username: "brianUchiha")
user2 = User.find_by(username: "AyyyaSayonara")
user3 = User.find_by(username: "HabiOppaiKing")
user4 = User.find_by(username: "SuperSaiyanIkumi")
user1.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/brian_zwyeui.jpg"), filename: "brian.jpg")
user2.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/aya_sqzo1w.jpg"), filename: "aya.jpg")
user3.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/javi_pps9n6.jpg"), filename: "javi.jpg")
user4.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600699/ikumi_lqqsra.png"), filename: "ikumi.jpg")

Review.create(
  [
    { user: user1, place: Place.all[3], rating: 4, comment: "Great coffee and cozy atmosphere!" },
    { user: user2, place: Place.all[3], rating: 5, comment: "Loved the ambiance and my children loved it." },
    { user: user3, place: Place.all[3], rating: 3, comment: "Stroller friedly but a bit pricey." },
    { user: user4, place: Place.all[3], rating: 4, comment: "Fresh food and friendly staff." }
  ]
)
