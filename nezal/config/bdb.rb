require 'data_store'

ENV["environment"] = "production"
DataStore::Database.initialize
