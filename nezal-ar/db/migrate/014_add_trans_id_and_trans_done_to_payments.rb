class AddTransIdAndTransDoneToPayments < ActiveRecord::Migration

  def self.up
    add_column :payments, :trans_id, :integer
    add_column :payments, :trans_done, :boolean, :default => false
    remove_column :payments, :profile_id
    add_column :payments, :profile_id, :string
  end

  def self.down
    remove_column :payments, :trans_id
    remove_column :payments, :trans_done
    remove_column :payments, :profile_id
    add_column :payments, :profile_id, :integer
  end  

end