require 'erb'
require 'rack/router'
require 'config/loader.rb'
require 'require_all'
require_all 'app/models/'
require_all 'app/controllers/'

use Rack::Session::Cookie
use	Rack::MethodOverride
use Rack::Static, :urls => ["/stylesheets", "/javascripts", "/favicon.ico", "/game_images"], :root => "public"
use Rack::ShowExceptions
  
router = Rack::Router.new(nil) do |r|
  r.map "/games/:game_id/courts", :to => CourtsController, :game_id => :game_id
  r.map "/games",   :to => GamesController
end

run router
