class CreateCampaigns < ActiveRecord::Migration

  def self.up
    create_table :campaigns do |t|
      t.column :name, :string, :null => false
      t.column :path, :string
      t.column :game_id, :int, :null => false
    end
  end

  def self.down
    drop_table :campaigns
  end
  
end
