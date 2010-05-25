require 'sinatra'
require 'erb'
require 'rack/router'

require 'db/db.rb'
require 'config/setup.rb'
require 'rackup/games/games.rb'

require 'require_all'
require_all 'app/models/'
require_all 'app/controllers/'

use	Rack::MethodOverride
use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"
use Rack::ShowExceptions
  
router = Rack::Router.new(nil) do |r|
  r.map "/studio-admin", :to => AdminController
end

run router
