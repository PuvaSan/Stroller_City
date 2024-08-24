class AddUserAndReviewToLikes < ActiveRecord::Migration[7.1]
  change_table :likes do |t|
    t.references :user, null: false, foreign_key: true
    t.references :review, null: false, foreign_key: true

  end
end
