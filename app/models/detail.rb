class Detail < ApplicationRecord
  belongs_to :trip
  # validates :latitude, :longitude, presence: true
end
