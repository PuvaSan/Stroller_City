puts "Destroying all records..."
# Destroy non-dependent records
Review.destroy_all
User.destroy_all
Place.destroy_all
puts "All records destroyed!"

puts "Creating 4 main users..."
# Create users
User.create!(
  [
    { email: "brianisloco@hotmail.com", password: "123456", username: "brianUchiha" },
    { email: "Aya0123@gmail.com", password: "secret", username: "AyyyaSayonara" },
    { email: "Javierisdaman@gmail.com", password: "pieking101", username: "HabiPieKing" },
    { email: "IkumiOjiro2017@gmail.com", password: "mybirthday01", username: "SuperSaiyanIkumi" }
  ]
)
puts "4 main users created!"

puts "Attaching photos to 4 main users..."
User.find_by(username: "brianUchiha").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/brian_zwyeui.jpg"), filename: "brian.jpg")
User.find_by(username: "AyyyaSayonara").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/aya_sqzo1w.jpg"), filename: "aya.jpg")
User.find_by(username: "HabiPieKing").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600697/javi_pps9n6.jpg"), filename: "javi.jpg")
User.find_by(username: "SuperSaiyanIkumi").photo.attach(io: URI.open("https://res.cloudinary.com/dzfjdlafz/image/upload/v1723600699/ikumi_lqqsra.png"), filename: "ikumi.jpg")
puts "Photos attached to 4 main users!"

def place_instantiator(place_id)
  url = "https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Cphoto%2Cformatted_address%2Cgeometry%2Cphoto&place_id=#{place_id}&key=#{ENV['GOOGLE_MAPS_API_KEY']}"
  fetch_place = URI.open(url).read
  place = JSON.parse(fetch_place)
  name = place["result"]["name"]
  address = place["result"]["formatted_address"]
  latitude = place["result"]["geometry"]["location"]["lat"]
  longitude = place["result"]["geometry"]["location"]["lng"]
  photo_reference = place["result"]["photos"][0]["photo_reference"]

  Place.create!(name: name, address: address, latitude: latitude, longitude: longitude, google_id: place_id)
  photourl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=#{photo_reference}&key=#{ENV['GOOGLE_MAPS_API_KEY']}"
  fetch_photo = URI.open(photourl)
  Place.last.photos.attach(io: fetch_photo, filename: "#{name}.jpg")
end

javi_places = {
  tokyo_skytree: "ChIJ35ov0dCOGGARKvdDH7NPHX0",
  tokyo_tower: "ChIJCewJkL2LGGAR3Qmk0vCTGkg",
  sensō_ji: "ChIJ8T1GpMGOGGARDYGSgpooDWw",
  shibuya_scramble_crossing: "ChIJK9EM68qLGGARacmu4KJj5SA"
}
puts "Creating 4 javi places..."
javi_places.each do |place, value|
  place_instantiator(value)
end
puts "4 javi places created!"

puts "creating more people..."
20.times {
  User.create!(
    email: Faker::Internet.email,
    password: "password",
    username: Faker::Internet.username(specifier: 5..11, separators: ['_']),
  )
  User.last.photo.attach(io: URI.open(Faker::LoremFlickr.image(size: "300x300", search_terms: ['people,japan'])), filename: "user#{User.last.id}.jpg")
}
puts "created 20 more people!"

puts "Creating 4 javi reviews..."
# Create reviews for places
Review.create!(
  [
    { user: User.all.sample, place: Place.all[0], rating: 4, comment: "Great coffee and cozy atmosphere!" },
    { user: User.all.sample, place: Place.all[1], rating: 4, comment: "Loved the ambiance and my children loved it." },
    { user: User.all.sample, place: Place.all[2], rating: 3, comment: "Stroller friendly but a bit pricey." },
    { user: User.all.sample, place: Place.all[3], rating: 4, comment: "Fresh food and friendly staff." }
  ]
)
puts "created 4 javi reviews!"

puts "Attaching photos to javi reviews..."
# Attach photos to reviews
  Review.all[0].photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625039/skytree-header_lvsoje.jpg"), filename: "skytree.jpg")
  Review.all[1].photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723624942/Tokyo-Tower--800x500_u6fept.jpg"), filename: "tokyo_tower.jpg")
  Review.all[2].photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625269/Sensoji_2023_uherro.jpg"), filename: "sensoji.jpg")
  Review.all[3].photos.attach(io: URI.open("https://res.cloudinary.com/dufvk5oei/image/upload/v1723625161/1189690204_f8lek8.webp"), filename: "shibuya.jpg")
puts "Updating javi review timestamps..."
# Update review timestamps if reviews exist
Review.all[0].update_column(:created_at, Time.new(2021, 8, 13, 12, 0, 0))
Review.all[1].update_column(:created_at, Time.new(2022, 8, 13, 12, 0, 0))
Review.all[2].update_column(:created_at, Time.new(2023, 8, 13, 12, 0, 0))
Review.all[3].update_column(:created_at, Time.new(2024, 8, 13, 12, 0, 0))
puts "Javi review timestamps updated! and photos attached!"

puts "Creating 5 aya places..."
aya_places = [
  {
    id: "ChIJ2y91MQGLGGARQKyRvVnpKRM",
    image: "https://www.thetokyochapter.com/wp-content/uploads/2017/04/happoen-7-1440x1440.jpg"
  },
  {
    id: "ChIJHeBCIOyMGGAR7BktETlUP_w",
    image: ""
  },
  {
    id: "ChIJO6bK3daOGGARYEFGg4Xm-VI",
    image: ""
  },
  {
    id: "ChIJJ2le0qqMGGARNa7U3TaIGsY",
    image: "https://www.thetokyochapter.com/wp-content/uploads/2017/04/shibuya-playcentre-5-1440x1440.jpg"
  },
  {
    id: "ChIJy1fvK2FVGGARCUQ1y2UMUiM",
    image: "https://www.thetokyochapter.com/wp-content/uploads/2017/12/ebina-babies.jpg"
  }
]
aya_places.each do |place|
  place_instantiator(place[:id])
  if place[:image].present?
    Place.last.photos.attach(io: URI.open(place[:image]), filename: "place#{Place.last.id}.jpg")
  end
end
puts "Photos attached to aya places!"
puts "creating aya reviews..."
Place.find_by(google_id: "ChIJ2y91MQGLGGARQKyRvVnpKRM").reviews.create!(user: User.all.sample, rating: 5, comment: "It was a very sunny day so I went for a walk 🌸
\n\nI was surprised to find such a quiet and beautiful place in Tokyo.
\n\nSince it was April, there were many families taking pictures of first-grade children carrying school bags on their backs, and as I walked along, I thought, ``It's so peaceful.'' ")
Review.last.photos.attach(io: URI.open("https://www.thetokyochapter.com/wp-content/uploads/2017/04/happoen-10-1440x1103.jpg"), filename: "happoen.jpg")
Place.find_by(google_id: "ChIJ2y91MQGLGGARQKyRvVnpKRM").reviews.create!(user: User.all.sample, rating: 5, comment: "It’s small enough to have a lovely walk with a baby in a carrier and there are gorgeous colours, lots of fish to look at and great photo opportunities.  It really doesn’t feel like you’re in the middle of the city anymore.
\n\nIf you come with a stroller I recommend leaving it in the venue hall as, like almost all Japanese gardens, there are lots of large stepping stones and stairs.  Keep an eye on children as there is a pond with fish.  Keep an eye out for the bonsai display at the top of the hill (on display year round) and the teahouse down the bottom (reservations required.)
\n\nIt’s a fantastic place for an early morning stroll and a cup of tea or coffee. There is a bakery/cafe and if you’re lucky enough to grab a balcony seat , you can look over the garden while you have a cuppa.")
Review.last.photos.attach(io: URI.open("https://www.thetokyochapter.com/wp-content/uploads/2017/04/happoen-2-1440x1440.jpg"), filename: "happoen2.jpg")
Place.find_by(google_id: "ChIJJ2le0qqMGGARNa7U3TaIGsY").reviews.create!(user: User.all.sample, rating: 5, comment: "I went to the play center in Shibuya with my 2 year old son. It was a great place to play with a lot of toys and a slide. The staff was very friendly and helpful. I would definitely recommend this place to other parents with young children.")
Place.find_by(google_id: "ChIJJ2le0qqMGGARNa7U3TaIGsY").reviews.create!(user: User.all.sample, rating: 5, comment: "This was amazing! Just what I needed with my little one. It was boiling hot outside and we couldn't walk anymore. I needed a nice place for my little one to burn off energy and this was the perfect spot!
\n\nMy little one loved the sand and they had a convient sand blower for when switching between play areas. She also loves the foam slides.
\n\nThe lady working there was also very helpful despite not understanding English, she went above and beyond to assist us even called us a taxi..")
Review.last.photos.attach(io: URI.open("https://lh5.googleusercontent.com/p/AF1QipOADiG7Q-KO5_rsqPzy-l_TD17KEh-zGY_RxkZe=w400-h400-k-no-p"), filename: "happoen2.jpg")
puts "created 4 aya reviews!"
Place.find_by(google_id: "ChIJHeBCIOyMGGAR7BktETlUP_w").reviews.create!(user: User.all.sample, rating: 5)
Place.find_by(google_id: "ChIJO6bK3daOGGARYEFGg4Xm-VI").reviews.create!(user: User.all.sample, rating: 5)
Place.find_by(google_id: "ChIJy1fvK2FVGGARCUQ1y2UMUiM").reviews.create!(user: User.all.sample, rating: 5)
Place.find_by(google_id: "ChIJy1fvK2FVGGARCUQ1y2UMUiM").reviews.create!(user: User.all.sample, rating: 5)

hapo = Place.find_by(google_id: "ChIJ2y91MQGLGGARQKyRvVnpKRM")
hapo.sc_facility_list.add("nursing room", "diaper changing station", "stroller-friendly entrance")
hapo.save
