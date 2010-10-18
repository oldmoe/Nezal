class Message < ActiveRecord::Base

  belongs_to  :profile, :class_name => "UserGameProfile"
  attr_accessible :type, :body, :profile_id
  
end
