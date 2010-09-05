class CreateFbUsers < ActiveRecord::Migration

  def self.up
    create_table :fb_users do |t|
      t.column :coins, :integer, :default => 1000
      t.column :fb_id, :string, :null => false
    end
    add_index(:fb_users, "fb_id" )
  end

  def self.down
    drop_table :fb_users
  end
  
end
