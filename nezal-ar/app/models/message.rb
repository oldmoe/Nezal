class Message < ActiveRecord::Base

  belongs_to  :profile, :class_name => "UserGameProfile"
  
  
end
