class CreateUserCampaigns < ActiveRecord::Migration

  def self.up
    create_table(:user_campaigns) do |t|
      t.column :campaign_id, :integer, :null => false
      t.column :profile_id, :integer, :null => false
      t.column :fb_user, :string, :null => false
      t.column :score, :integer, :null => false, :default => 0
      t.column :metadata, :string # This is supposed to hold the user game profile specific data hash
                                  # Hash transformed into string and converted back upon need
    end
    add_index(:user_campaigns, [:campaign_id, :score])
  end

  def self.down
    drop_table :user_campaigns
  end
  
end
