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

#DB.drop_table(:predictions)
DB.create_table? :predictions do
  primary_key :id
  foreign_key :match_id, :null => false
  foreign_key [:app_id, :user_id], :users, :name => :user, :null => false
  String  :app_id
  String  :user_id
  Integer :goals_a
  Integer :goals_b
  Integer :kicks_a
  Integer :kicks_b
end

#DB.drop_table :users
DB.create_table? :users do
  column  :app_id , :string
  column  :user_id, :string
  column  :global_score, :integer, :default => 64
  column  :first_round_score, :integer, :default => 48
  column  :round16_score, :integer, :default => 8
  column  :quarters_score, :integer, :default => 4
  column  :semis_score, :integer, :default => 2
  column  :finals_score, :integer, :default => 2
  primary_key [:app_id, :user_id], :auto_increment => false
end

indexes = DB.indexes(:users)
#DB.drop_index :users,  [:app_id, :first_round_score]
#DB.drop_index :users,  [:app_id, :round16_score]
#DB.drop_index :users,  [:app_id, :quarters_score]
#DB.drop_index :users,  [:app_id, :semis_score]
#DB.drop_index :users,  [:app_id, :finals_score]
#DB.drop_index :users,  [:app_id, :global_score]
DB.add_index :users, [:app_id, :first_round_score, :user_id] unless indexes[:users_app_id_first_round_score_user_id_index] 
DB.add_index :users, [:app_id, :round16_score, :user_id] unless indexes[:users_app_id_round16_score_user_id_index] 
DB.add_index :users, [:app_id, :quarters_score, :user_id] unless indexes[:users_app_id_quarters_score_user_id_index] 
DB.add_index :users, [:app_id, :semis_score, :user_id] unless indexes[:users_app_id_semis_score_user_id_index] 
DB.add_index :users, [:app_id, :finals_score, :user_id] unless indexes[:users_app_id_finals_score_user_id_index]
DB.add_index :users, [:app_id, :global_score, :user_id] unless indexes[:users_app_id_global_score_user_id_index]  

=begin
  require 'app/models/user'
  require 'app/models/team'
  require 'app/models/match'
  require 'app/models/prediction'
  #User.create({:app_id=>"103040546410849", :user_id=>"750199343"})
  user = User.first
  p user
  match = Match.first
  Prediction.create({:user => user, :match => match})
  p  pred = Prediction.first
  p pred.dataset.all
=end

require 'app/models/user'
#(1..1000).each do |i|
#  User.find_or_create({:app_id=>"103040546410849", :user_id=>"750199345"+i.to_s, :first_round_score => 5+(i%6)})
#end

require 'app/models/group'
('A'..'H').each do |i| 
  Group.find_or_create(:name => i) 
end


