# puts "Destroying all records..."
# Destroy non-dependent records
# Review.destroy_all
# User.destroy_all
# Place.destroy_all
# puts "All records destroyed!"

# puts "Creating 4 main users..."
# # Create users
# User.create!(
#   [
#     { email: "brianisloco@hotmail.com", password: "123456", username: "brianUchiha" },
#     { email: "Aya0123@gmail.com", password: "secret", username: "AyyyaSayonara" },
#     { email: "Javierisdaman@gmail.com", password: "pieking101", username: "HabiPieKing" },
#     { email: "IkumiOjiro2017@gmail.com", password: "mybirthday01", username: "SuperSaiyanIkumi" }
#   ]
# )
# puts "4 main users created!"

# puts "Attaching photos to 4 main users..."
# User.find_by(username: "brianUchiha").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/brian_zwyeui.jpg"), filename: "brian.jpg")
# User.find_by(username: "AyyyaSayonara").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/aya_sqzo1w.jpg"), filename: "aya.jpg")
# User.find_by(username: "HabiPieKing").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/javi_pps9n6.jpg"), filename: "javi.jpg")
# User.find_by(username: "SuperSaiyanIkumi").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600699/ikumi_lqqsra.png"), filename: "ikumi.jpg")
# puts "Photos attached to 4 main users!"

# def place_instantiator(place_id)
#   url = "https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cphoto%2Cformatted_address%2Cgeometry&place_id=#{place_id}&key=#{ENV['GOOGLE_MAPS_API_KEY']}"

#   fetch_place = URI.open(url)
#   place = JSON.parse(fetch_place.read)
#   name = place["result"]["name"]
#   address = place["result"]["formatted_address"]
#   latitude = place["result"]["geometry"]["location"]["lat"]
#   longitude = place["result"]["geometry"]["location"]["lng"]

#   Place.create!(name: name, address: address, latitude: latitude, longitude: longitude)
# end
# javi_places = {
#   tokyo_skytree: "ChIJ35ov0dCOGGARKvdDH7NPHX0",
#   tokyo_tower: "ChIJCewJkL2LGGAR3Qmk0vCTGkg",
#   sensō_ji: "ChIJ8T1GpMGOGGARDYGSgpooDWw",
#   shibuya_scramble_crossing: "ChIJK9EM68qLGGARacmu4KJj5SA"
# }
# puts "Creating 4 javi places..."
# javi_places.each do |place, value|
#   place_instantiator(value)
# end
# puts "4 javi places created!"

# puts "creating more people..."
# 20.times {
#   User.create!(
#     email: Faker::Internet.email,
#     password: "password",
#     username: Faker::Name.unique.name,
#   )
#   User.last.photo.attach(io: URI.open(Faker::LoremFlickr.image(size: "300x300", search_terms: ['people,japan'])), filename: "user#{User.last.id}.jpg")
# }
# puts "created 20 more people!"

puts "Creating reviews..."
# Create reviews for places
Review.create!(
  [
    { user: user1, place: places[1], rating: 4, comment: "Great coffee and cozy atmosphere!" },
    { user: user2, place: places[1], rating: 5, comment: "Loved the ambiance and my children loved it." },
    { user: user3, place: places[0], rating: 3, comment: "Stroller friendly but a bit pricey." },
    { user: user4, place: places[0], rating: 4, comment: "Fresh food and friendly staff." }
  ]
)

puts "Attaching photos to reviews..."
# Attach photos to reviews
if Review.exists?(5)
  Review.find(5).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625039/skytree-header_lvsoje.jpg"), filename: "skytree.jpg")
end

if Review.exists?(6)
  Review.find(6).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723624942/Tokyo-Tower--800x500_u6fept.jpg"), filename: "tokyo_tower.jpg")
end

if Review.exists?(7)
  Review.find(7).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625269/Sensoji_2023_uherro.jpg"), filename: "sensoji.jpg")
end

if Review.exists?(8)
  Review.find(8).photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625161/1189690204_f8lek8.webp"), filename: "shibuya.jpg")
end

puts "Updating review timestamps..."
# Update review timestamps if reviews exist
Review.find_by(id: 1)&.update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find_by(id: 2)&.update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find_by(id: 3)&.update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.find_by(id: 4)&.update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))

puts "Seeding complete"
