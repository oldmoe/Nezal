class Rank < ActiveRecord::Base
  
  belongs_to :game
  attr_accessible :name, :lower_exp, :upper_exp
  
end
