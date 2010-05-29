# encoding: utf-8
require 'sequel'
require 'logger'

DB = Sequel.sqlite('./db/studio.db', :logger => Logger.new('log/db.log'))

DB.create_table? :groups do
  primary_key :id
  String :name, :unique => true
end

DB.create_table? :teams do
  primary_key :id
  String :name
  Integer :ranking
  String :name_ar
  String :abrv
  String :info
end

DB.create_table? :locations do
  primary_key :id
  String :name
  String :name_ar
  String :city_name
  String :city_name_ar
end

DB.create_table? :matches do
  primary_key :id
  foreign_key :group_id, :null => false
  foreign_key :team_a_id, :null => false
  foreign_key :team_b_id, :null => false
  foreign_key :location_id, :null => false
  Integer :goals_a
  Integer :goals_b
  Integer :kicks_a
  Integer :kicks_b
  Time    :start_time
end

DB.create_table? :predictions do
  primary_key :id
  foreign_key :user_id, :null => false
  foreign_key :match_id, :null => false
  Integer :goals_a
  Integer :goals_b
  Integer :kicks_a
  Integer :kicks_b
end

DB.create_table? :users do
  column :app_id , :string
  column  :user_id, :string
  primary_key [:app_id, :user_id], :auto_increment => false
end

require 'app/models/group'
('A'..'H').each do |i| 
  Group.find_or_create(:name => i) 
end

