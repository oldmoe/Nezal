require 'erb'
require 'rack/router'
require 'sinatra'
require 'yajl/json_gem'
require 'require_all'

require "#{Dir.pwd}/config/setup.rb"
require_all "#{Dir.pwd}/app/models/"
require_all "#{Dir.pwd}/app/controllers/"

require "#{Dir.pwd}/rackup/games/games.rb"

use	Rack::MethodOverride
use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"
use Rack::Static, :urls => [ "/city-defender/css", "/city-defender/js", "/city-defender/images", "/city-defender/templates", "/city-defender/index.html"], :root => "public"
use Rack::ShowExceptions
  
router = Rack::Router.new(nil) do |r|
  r.map "/fb-games/users", :to => UsersController
  r.map "/fb-games", :to => GamesController
  r.map "/nezal-admin", :to => AdminController
end

run router
