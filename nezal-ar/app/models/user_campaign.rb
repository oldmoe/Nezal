class UserCampaign < ActiveRecord::Base

  belongs_to  :campaign, :class_name => "Campaign"
  belongs_to  :profile, :class_name => "UserGameProfile"
  
end
