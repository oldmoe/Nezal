class CreateIndexes < ActiveRecord::Migration

  def self.up
    add_index(:ranks, "game_id")
    add_index(:campaigns, ["game_id", "path"], :name => "campaign_by_game_and_path_index")
  end

  def self.down
    remove_index(:ranks, "game_id")
    remove_index(:campaigns, "campaign_by_game_and_path_index")
  end
  
end
