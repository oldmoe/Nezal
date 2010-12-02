class ChangeFbUsersToUsers < ActiveRecord::Migration

  def self.up
    remove_index(:fb_users, :fb_id)
    rename_column(:fb_users, :fb_id, :service_id)
    rename_table(:fb_users, :users)
    add_column :users, :service_type, :int, :default => 0
    add_index(:users, [:service_type, :service_id])
  end

  def self.down
    remove_index(:users, [:service_type, :service_id])
    remove_column(:users, :service_type)  
    rename_column(:users, :service_id, :fb_id)  
    rename_table(:users, :fb_users)
    add_index(:fb_users, :fb_id)
  end
  
end
