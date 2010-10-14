class AddCreatedAt < ActiveRecord::Migration

  @@tables = [:fb_users, :campaigns, :user_game_profiles]

  def self.up
	@@tables.each{|table| add_column(table, :created_at, :date, :default => Time.now)}
  end

  def self.down
	@@tables.each{|table| remove_column(table, :created_at)}
  end
  
end
