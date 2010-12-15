class CreateQuests < ActiveRecord::Migration

  def self.up
    create_table :quests do |t|
      t.column :name, :string, :null => false # Quest name
      t.column :primal, :boolean, :default => false # Wether or not this quest is the begining of a new quest
      t.column :parent, :integer # Next quest to be opened once the gamer passes this one
      t.column :game_id, :integer, :null => false # Game id to point which game this quest belongs to
      t.column :metadata, :string # This is supposed to hold the quest specific data hash
                                  # Hash transformed into string and converted back upon need
    end
  end

  def self.down
    drop_table :quests
  end
  
end
