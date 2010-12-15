class ChangeUserCampaignFbUserToUserId < ActiveRecord::Migration

  def self.up
    remove_index(:user_campaigns, [:campaign_id, :fb_user])
    remove_index(:user_campaigns, [:fb_user, :campaign_id])
    remove_index(:user_campaigns, [:campaign_id, :score, :fb_user])
    rename_column(:user_campaigns, :fb_user, :user_id)
    add_column(:user_campaigns, :service_type, :int, :default => 0)
    add_index(:user_campaigns, [:campaign_id, :user_id])
    add_index(:user_campaigns, [:user_id, :campaign_id])
    add_index(:user_campaigns, [:campaign_id, :service_type, :score, :user_id], :name => "user_camp_by_id_service_type_score_user_id")
  end

  def self.down
    remove_index(:user_campaigns, [:campaign_id, :user_id])
    remove_index(:user_campaigns, [:user_id, :campaign_id])
    remove_index(:user_campaigns, :name => "user_camp_by_id_service_type_score_user_id" )
    remove_column(:user_campaigns, :service_type)  
    rename_column(:user_campaigns, :user_id, :fb_user)
    add_index(:user_campaigns, [:campaign_id, :fb_user])
    add_index(:user_campaigns, [:fb_user, :campaign_id])
    add_index(:user_campaigns, [:campaign_id, :score, :fb_user])
  end
  
end
