class Priority < ActiveRecord::Base
  attr_accessible :color, :name, :urgency_index

  has_many :tasks
end
