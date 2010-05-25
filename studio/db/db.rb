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
#  foreign_key :group_id, :null => false
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
  Integer :result_a
  Integer :result_b
  Date    :start_time
end

require 'app/models/group'
require 'app/models/team'
('A'..'H').each do |i| 
  Group.find_or_create(:name => i) 
end

