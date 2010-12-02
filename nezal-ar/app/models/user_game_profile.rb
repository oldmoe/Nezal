class UserGameProfile < ActiveRecord::Base
  
  belongs_to    :game
  belongs_to    :rank
  belongs_to    :user, :class_name => "User", :foreign_key => "user_id"
  has_many      :user_campaigns, :dependent => :destroy, :autosave => true, :foreign_key => 'profile_id'
  
  validates_uniqueness_of :game_id, :scope => :user_id
  
  before_save do
    if ( self.rank.nil? && self.game_id )
      self.rank = Game.find(self.game_id).ranks.first(:order => :lower_exp)
    end
  end
  
end
