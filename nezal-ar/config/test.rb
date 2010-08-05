require 'active_record'
require 'yaml'

dbconfig = YAML::load(File.open('config/database.yml'))
ActiveRecord::Base.establish_connection(dbconfig['test'])

Kernel::require_relative '../app/models/game'
Kernel::require_relative '../app/models/rank'
Kernel::require_relative '../app/models/campaign'

game = Game.new(:name => 'city_defender')
game.save
p game
