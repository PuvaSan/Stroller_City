class CreateTrips < ActiveRecord::Migration[7.1]
  def change
    create_table :trips do |t|
      t.references :route, null: false, foreign_key: true
      t.string :travel_mode
      t.string :title
      t.integer :distance
      t.integer :duration
      t.string :formatted_distance
      t.string :formatted_duration
      t.string :start_stop_name
      t.string :start_stop_id
      t.datetime :start_time
      t.string :end_stop_name
      t.string :end_stop_id
      t.datetime :end_time
      t.string :service_name
      t.string :service_link

      t.timestamps
    end
  end
end
