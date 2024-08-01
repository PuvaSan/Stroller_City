class CreateDetails < ActiveRecord::Migration[7.1]
  def change
    create_table :details do |t|
      t.references :trip, null: false, foreign_key: true
      t.string :title
      t.string :action
      t.integer :distance
      t.integer :duration
      t.string :formatted_distance
      t.string :formatted_duration
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
