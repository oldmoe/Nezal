class CreateUserGameProfiles < ActiveRecord::Migration

  def self.up
    create_table :user_game_profiles do |t|
      t.column :exp, :integer, :default => 0
      t.column :game_id, :integer, :null => false
      t.column :rank_id, :integer, :null => false
      t.column :user_id, :integer, :null => false
      t.column :locale, :string,   :default => nil
      t.column :newbie,  :boolean, :default => true
      t.column :metadata, :string # This is supposed to hold the user game profile specific data hash
                                  # Hash transformed into string and converted back upon need
    end
    add_index(:user_game_profiles, ["game_id", "user_id"])
  end

  def self.down
    drop_table :user_game_profiles
  end
  
end
