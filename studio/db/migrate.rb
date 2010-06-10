# encoding: utf-8
require 'sequel'
require 'logger'

DB = Sequel.sqlite('./db/studio.db', :logger => Logger.new('log/db.log'))

indexes = DB.indexes(:users)
p indexes

indexes = DB.indexes(:predictions)
p indexes

indexes = DB.indexes(:comments)
p indexes

indexes = DB.indexes(:users)
DB.drop_index :users, [:app_id, :global_score] if (indexes[:users_app_id_global_score_index])
DB.drop_index :users, [:app_id, :finals_score] if (indexes[:users_app_id_finals_score_index])
DB.drop_index :users, [:app_id, :semis_score] if (indexes[:users_app_id_semis_score_index])
DB.drop_index :users, [:app_id, :quarters_score] if (indexes[:users_app_id_quarters_score_index])
DB.drop_index :users, [:app_id, :round16_score] if (indexes[:users_app_id_round16_score_index])
DB.drop_index :users, [:app_id, :first_round_score] if (indexes[:users_app_id_first_round_score_index])


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

#DB.drop_table(:predictions)
#DB.drop_table :comments
#DB.drop_table :users
DB.add_column(:predictions, :score, :integer)
