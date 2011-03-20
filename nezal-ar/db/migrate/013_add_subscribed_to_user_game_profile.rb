class AddSubscribedToUserGameProfile < ActiveRecord::Migration

  def self.up
    add_column :user_game_profiles, :subscribed, :boolean, :default => false
  end

  def self.down
    remove_column :user_game_profiles, :subscribed
  end  

end