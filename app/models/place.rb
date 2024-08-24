class Place < ApplicationRecord
  acts_as_taggable_on :sc_facilities
  acts_as_favoritable
  has_many :reviews, dependent: :destroy
  has_many_attached :photos
end
