class CreateRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :routes do |t|
      t.string :start_address
      t.string :end_address
      t.datetime :start_time
      t.datetime :end_time
      t.integer :distance
      t.integer :duration
      t.string :formatted_distance
      t.string :formatted_duration
      t.integer :cost
      t.string :currency

      t.timestamps
    end
  end
end
