class CreateGames < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.column :name, :string, :null => false
      t.column :description, :string
      t.column :current_campaign_id, :integer
    end
  end

  def self.down
    drop_table :games
  end
end
