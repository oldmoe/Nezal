require 'yaml'
require 'logger'
require 'erb'
require 'sinatra'
require 'rack/router'

require 'db/db.rb'
require 'config/app_setup.rb'

require 'require_all'
require_all 'app/models/'
require_all 'app/controllers/'

# Initialize Application Logger
LOGGER = Logger.new(STDOUT)
LOGGER.level = Logger::DEBUG

