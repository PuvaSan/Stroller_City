puts "Destroying all records..."

# Destroy dependent records first
Detail.destroy_all
Trip.destroy_all
Route.destroy_all

# Destroy non-dependent records
Review.destroy_all
User.destroy_all
Place.destroy_all

# (Your seed data creation code follows here...)

# Create places
# Place creation code here...

# Create routes
# Route creation code here...
#Create places

data['places_info'].each do |place|
  Place.create!(
    address: place['address'],
    latitude: place['gps_coordinates']['latitude'],
    longitude: place['gps_coordinates']['longitude']
  )
end

# # Create routes
# data['directions'].each do |direction|
#   route = Route.create!(
#     start: Place.first,
#     end: Place.last,
#     start_time: direction['start_time'],
#     end_time: direction['end_time'],
#     distance: direction['distance'],
#     duration: direction['duration'],
#     formatted_distance: direction['formatted_distance'],
#     formatted_duration: direction['formatted_duration'],
#     cost: direction['cost'],
#     currency: direction['currency']
#   )

  # Create trips and details
  # direction['trips'].each do |trip_data|
  #   trip = Trip.create!(
  #     route: route,
  #     travel_mode: trip_data['travel_mode'],
  #     title: trip_data['title'],
  #     distance: trip_data['distance'],
  #     duration: trip_data['duration'],
  #     formatted_distance: trip_data['formatted_distance'],
  #     formatted_duration: trip_data['formatted_duration'],
  #     start_stop_name: trip_data.dig('start_stop', 'name'),
  #     start_stop_id: trip_data.dig('start_stop', 'stop_id'),
  #     start_time: trip_data.dig('start_stop', 'time'),
  #     end_stop_name: trip_data.dig('end_stop', 'name'),
  #     end_stop_id: trip_data.dig('end_stop', 'stop_id'),
  #     end_time: trip_data.dig('end_stop', 'time'),
  #     service_name: trip_data.dig('service_run_by', 'name'),
  #     service_link: trip_data.dig('service_run_by', 'link')
  #   )

#     # Only iterate over details if they exist
#     if trip_data['details']
#       trip_data['details'].each do |detail_data|
#         Detail.create!(
#           trip: trip,
#           title: detail_data['title'],
#           action: detail_data['action'],
#           distance: detail_data['distance'],
#           duration: detail_data['duration'],
#           formatted_distance: detail_data['formatted_distance'],
#           formatted_duration: detail_data['formatted_duration'],
#           latitude: detail_data.dig('gps_coordinates', 'latitude'),
#           longitude: detail_data.dig('gps_coordinates', 'longitude')
#         )
#       end
#     end
#   end
# end

User.create!(
  [
    { email: "brianisloco@hotmail.com", password: "123456", username: "brianUchiha" },
    { email: "Aya0123@gmail.com", password: "secret", username: "AyyyaSayonara" },
    { email: "Javierisdaman@gmail.com", password: "pieking101", username: "HabiPieKing" },
    { email: "IkumiOjiro2017@gmail.com", password: "mybirthday01", username: "SuperSaiyanIkumi" }
  ]
)

# Find users to attach photos
user1 = User.find_by(username: "brianUchiha")
user2 = User.find_by(username: "AyyyaSayonara")
user3 = User.find_by(username: "HabiPieKing")
user4 = User.find_by(username: "SuperSaiyanIkumi")

# Attach photos
user1.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/brian_zwyeui.jpg"), filename: "brian.jpg")
user2.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/aya_sqzo1w.jpg"), filename: "aya.jpg")
user3.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/javi_pps9n6.jpg"), filename: "javi.jpg")
user4.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600699/ikumi_lqqsra.png"), filename: "ikumi.jpg")

puts "creating places"
# Create places
Place.create!(
  [
    { address: "Tokyo Skytree", latitude: 35.71024561621056, longitude: 139.81074331053827 },
    { address: "Tokyo Tower", latitude: 35.658676362124375, longitude: 139.7453792510146 },
    { address: "Sensoji Temple", latitude: 35.715056833214376, longitude: 139.79663381563967 },
    { address: "Shibuya Scramble Crossing", latitude: 35.65969990070708, longitude: 139.70059178169979 }
  ]
)

puts "creating reviews"
# Create reviews for places
Review.create!(
  [
    { user: user1, place: Place.all[1], rating: 4, comment: "Great coffee and cozy atmosphere!" },
    { user: user2, place: Place.all[1], rating: 5, comment: "Loved the ambiance and my children loved it." },
    { user: user3, place: Place.all[0], rating: 3, comment: "Stroller friedly but a bit pricey." },
    { user: user4, place: Place.all[0], rating: 4, comment: "Fresh food and friendly staff." }
  ]
)

puts "creating photos"
# Attach photos to reviews
Review.find(5).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625039/skytree-header_lvsoje.jpg"), filename: "skytree.jpg")
Review.find(6).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723624942/Tokyo-Tower--800x500_u6fept.jpg"), filename: "tokyo_tower.jpg")
Review.find(7).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625269/Sensoji_2023_uherro.jpg"), filename: "sensoji.jpg")
Review.find(8).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625161/1189690204_f8lek8.webp"), filename: "shibuya.jpg")

# Update review timestamps
Review.find(1).update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find(2).update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find(3).update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find(4).update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))

puts "updating reviews"

puts "seeding complete"
