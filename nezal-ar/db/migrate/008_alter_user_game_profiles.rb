class AlterUserGameProfiles < ActiveRecord::Migration
  def self.up
    add_column :user_game_profiles, :bookmarked, :boolean, :default => false
    add_column :user_game_profiles, :like, :boolean, :default => false
  end

  def self.down
  end
end

