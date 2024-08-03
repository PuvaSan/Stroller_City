class Route < ApplicationRecord
    belongs_to :start, class_name: "Place"
    belongs_to :end, class_name: "Place"
    has_many :trips
    has_many :details, through: :trips
end
