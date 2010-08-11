class CreateCampaigns < ActiveRecord::Migration

  def self.up
    create_table :campaigns do |t|
      t.column :name, :string, :null => false
      t.column :path, :string
      t.column :game_id, :int, :null => false
      t.column :metadata, :string # This is supposed to hold the campaign specific data
                                  # For city-defender this should hold mission : name, path & order
                                  # Hash transformed into string and converted back upon need
    end
  end

  def self.down
    drop_table :campaigns
  end
  
end
