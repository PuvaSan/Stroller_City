class CreatePlaces < ActiveRecord::Migration[7.1]
  def change
    create_table :places do |t|
      t.references :route, null: false, foreign_key: true
      t.string :address
      t.float :latitude
      t.float :longitude

      t.timestamps
    end
  end
end
