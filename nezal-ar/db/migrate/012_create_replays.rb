class CreateReplays < ActiveRecord::Migration

  def self.up
    create_table(:replays) do |t|
      t.column :game_id, :integer, :null => false
      t.column :profile_id, :integer, :null => false
      t.column :score, :integer, :null => false
      t.column :replay, :string, :null => false
      t.column :camp_name, :string, :null => false
      t.column :mission_name, :string, :null => false
      t.column :level, :string, :null => false
    end
  end

  def self.down
    drop_table :replays
  end
  
end
