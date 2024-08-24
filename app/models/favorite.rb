
class Favorite < ApplicationRecord
  extend ActsAsFavoritor::FavoriteScopes

  belongs_to :favoritable, polymorphic: true
  belongs_to :favoritor, polymorphic: true
  has_many :likes
  has_many :liked_by_users, through: :likes, source: :user

  def block!
    update!(blocked: true)
  end
end
