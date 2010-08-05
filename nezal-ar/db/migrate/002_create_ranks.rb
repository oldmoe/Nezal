class CreateRanks < ActiveRecord::Migration

  def self.up
    create_table :ranks do |t|
      t.column :name, :string, :null => false
      t.column :game_id, :integer, :null => false
      t.column :lower_exp, :integer, :null => false
      t.column :upper_exp, :integer, :null => false
    end
  end

  def self.down
    drop_table :ranks
  end
  
end
