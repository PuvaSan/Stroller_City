class AddGoogleIdToPlaces < ActiveRecord::Migration[7.1]
  def change
    add_column :places, :google_id, :string
  end
end
