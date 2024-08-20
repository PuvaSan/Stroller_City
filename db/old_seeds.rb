puts "Destroying all records..."

# Destroy dependent records first to avoid foreign key violations
Detail.destroy_all
Trip.destroy_all
Route.destroy_all

# Destroy non-dependent records
Review.destroy_all
User.destroy_all
Place.destroy_all

puts "Creating users..."
# Create users
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

puts "Attaching photos to users..."
# Attach photos if users were created successfully
if user1 && user2 && user3 && user4
  user1.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/brian_zwyeui.jpg"), filename: "brian.jpg")
  user2.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/aya_sqzo1w.jpg"), filename: "aya.jpg")
  user3.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/javi_pps9n6.jpg"), filename: "javi.jpg")
  user4.photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600699/ikumi_lqqsra.png"), filename: "ikumi.jpg")
else
  puts "Error: One or more users were not found, skipping photo attachments."
end

puts "Creating places..."
# Create places
places = Place.create!(
  [
    { address: "Tokyo Skytree", latitude: 35.71024561621056, longitude: 139.81074331053827 },
    { address: "Tokyo Tower", latitude: 35.658676362124375, longitude: 139.7453792510146 },
    { address: "Sensoji Temple", latitude: 35.715056833214376, longitude: 139.79663381563967 },
    { address: "Shibuya Scramble Crossing", latitude: 35.65969990070708, longitude: 139.70059178169979 }
  ]
)

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
