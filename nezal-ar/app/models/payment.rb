class Payment < ActiveRecord::Base
  belongs_to  :profile, :class_name => "UserGameProfile"
  attr_accessible :profile_id , :price
end
