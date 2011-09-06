module DataStore
  VERSION = '0.0.1'
end

require './lib/index'
require './lib/model'
require './lib/drivers/generic'
require './lib/drivers/sqlite'
require './lib/drivers/memory'
require './lib/drivers/redis'
require './lib/drivers/bdb'
