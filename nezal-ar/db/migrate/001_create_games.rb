class CreateGames < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.column :name, :string, :null => false
      t.column :description, :string
      t.column :current_campaign_id, :integer
      t.column :metadata, :string # This is supposed to hold the game specific data hash
                                  # Hash transformed into string and converted back upon need
    end
  end

  def self.down
    drop_table :games
  end
end
