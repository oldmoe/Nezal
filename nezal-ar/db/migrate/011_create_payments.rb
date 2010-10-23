class CreatePayments < ActiveRecord::Migration

  def self.up
    create_table(:payments) do |t|
      t.column :profile_id, :integer, :null => false
      t.column :price, :string, :null => false
    end
  end

  def self.down
    drop_table :payments
  end
  
end
