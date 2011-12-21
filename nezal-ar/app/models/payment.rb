class Payment < ActiveRecord::Base
  belongs_to  :profile, :class_name => "UserGameProfile"
  attr_accessible :profile_id , :price, :trans_id, :trans_done
end
