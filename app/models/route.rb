class Route < ApplicationRecord
  has_many :places
  has_many :trips
end
