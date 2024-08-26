class Review < ApplicationRecord
  acts_as_favoritable
  belongs_to :place
  belongs_to :user

  validates :rating, presence: true, inclusion: { in: 1..5 }
  has_many_attached :photos
end
