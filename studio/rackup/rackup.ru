require 'config/setup.rb'
require 'rackup/games/games.rb'

use	Rack::MethodOverride
use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"
use Rack::ShowExceptions
  
router = Rack::Router.new(nil) do |r|
  r.map "/studio-admin", :to => AdminController
  FB_CONFIGS.each do |key, value|  
    r.map "/#{value['name']}", :to => StudioController
  end
end

run router
