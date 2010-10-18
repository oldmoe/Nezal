class CreateMessages < ActiveRecord::Migration

  def self.up
    create_table(:messages) do |t|
      t.column :profile_id, :integer, :null => false
      t.column :body, :string, :null => false
      t.column :type, :string, :null => false
    end
  end

  def self.down
    drop_table :messages
  end
  
end
