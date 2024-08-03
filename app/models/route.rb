class Route < ApplicationRecord
  has_many :trips
  has_many :details, through: :trips
end
