# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_03_055053) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "details", force: :cascade do |t|
    t.bigint "trip_id", null: false
    t.string "title"
    t.string "action"
    t.integer "distance"
    t.integer "duration"
    t.string "formatted_distance"
    t.string "formatted_duration"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["trip_id"], name: "index_details_on_trip_id"
  end

  create_table "places", force: :cascade do |t|
    t.string "name"
    t.string "address"
    t.decimal "latitude"
    t.decimal "longitude"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "routes", force: :cascade do |t|
    t.bigint "start_id", null: false
    t.bigint "end_id", null: false
    t.integer "distance"
    t.datetime "start_time"
    t.datetime "end_time"
    t.integer "duration"
    t.string "formatted_distance"
    t.string "formatted_duration"
    t.integer "cost"
    t.string "currency"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["end_id"], name: "index_routes_on_end_id"
    t.index ["start_id"], name: "index_routes_on_start_id"
  end

  create_table "trips", force: :cascade do |t|
    t.bigint "route_id", null: false
    t.string "travel_mode"
    t.string "title"
    t.integer "distance"
    t.integer "duration"
    t.string "formatted_distance"
    t.string "formatted_duration"
    t.string "start_stop_name"
    t.string "start_stop_id"
    t.datetime "start_time"
    t.string "end_stop_name"
    t.string "end_stop_id"
    t.datetime "end_time"
    t.string "service_name"
    t.string "service_link"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["route_id"], name: "index_trips_on_route_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "details", "trips"
  add_foreign_key "routes", "places", column: "end_id"
  add_foreign_key "routes", "places", column: "start_id"
  add_foreign_key "trips", "routes"
end
