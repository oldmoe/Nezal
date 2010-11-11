class Replay < ActiveRecord::Base
  belongs_to  :profile, :class_name => "UserGameProfile"
  attr_accessible :profile_id ,:game_id, :replay, :score,:camp_name,:mission_name,:level
end
