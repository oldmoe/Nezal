# encoding: utf-8
require 'sequel'
require 'logger'

DB = Sequel.sqlite('./db/studio.db', :logger => Logger.new('log/db.log'))

p DB.schema( :matches)
puts
puts
p DB.schema( :predictions)  

# == First Migration == #
#DB.drop_column(:matches, :result_a)
#DB.drop_column(:matches, :result_b)
#DB.add_column(:matches, :goals_a, :integer)
#DB.add_column(:matches, :goals_b, :integer)
#DB.add_column(:matches, :kicks_a, :integer)
#DB.add_column(:matches, :kicks_b, :integer)

# == Second Migration == #
#DB.add_column(:teams, :youtube_url, :string)
#DB.add_column(:matches, :youtube_url, :string)

DB.drop_table(:predictions)
DB.drop_table :comments
DB.drop_table :users

