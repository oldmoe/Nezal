require 'erb'
require 'rack/router'
require 'config/bdb.rb'
require 'require_all'
require_all 'app/models/'
require_all 'app/controllers/'
require 'rackup/games/games.rb'

use	Rack::MethodOverride
use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"
use Rack::ShowExceptions
  
router = Rack::Router.new(nil) do |r|
  r.map "/fb-games/users", :to => FBUsersController
  r.map "/fb-games", :to => FBGamesController
  r.map "/games", :to => GamesController
  r.map "/", :to => InitController
end

run router
