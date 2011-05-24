class AddIndexes < ActiveRecord::Migration

  def self.up
    add_index(:user_game_profiles, "user_id")
    add_index(:user_game_profiles, ["game_id","rank_id"],:name =>"user_game_profiles by game_id and rank_id")
    add_index(:users, ["service_type","service_id"],:name => "users by service type and service_id")
  end

  def self.down
    remove_index(:user_game_profiles, "user_id")
    remove_index(:user_game_profiles,"user_game_profiles by game_id and rank_id")
    remove_index(:users,"users by service type and service_id")
  end
  
end

