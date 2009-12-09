require 'erb'
require 'require_all'
require "rack/router"
require_all 'app/models/'
require_all 'app/controllers/'

use	Rack::MethodOverride
use Rack::Static, :urls => ["/stylesheets", "/javascripts", "/favicon.ico", "/test.html"], :root => "public"
use Rack::ShowExceptions


router = Rack::Router.new(nil) do |r|
  r.map "/rooms/:room_id/events", :to => EventsController, :room_id => :room_id
  r.map "/rooms",   :to => RoomsController
  r.map "/", :to => TestController
  
end

run router
