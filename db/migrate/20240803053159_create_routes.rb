class CreateRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :routes do |t|
      t.references :start, null: false, foreign_key: { to_table: :places }
      t.references :end, null: false, foreign_key: { to_table: :places }
      t.integer :distance
      t.datetime :start_time
      t.datetime :end_time
      t.integer :duration
      t.string :formatted_distance
      t.string :formatted_duration
      t.integer :cost
      t.string :currency

      t.timestamps
    end
  end
end
