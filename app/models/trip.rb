class Trip < ApplicationRecord
  belongs_to :route
  has_many :details
end
