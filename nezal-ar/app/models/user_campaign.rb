class UserCampaign < ActiveRecord::Base

  belongs_to  :campaign, :class_name => "Campaign"
  belongs_to  :profile, :class_name => "UserGameProfile"

  before_save do
    self.service_type = self.profile.user.service_type
  end
  
end
