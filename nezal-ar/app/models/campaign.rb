class Campaign < ActiveRecord::Base
  
  belongs_to :game
  attr_accessible :name, :path

end
