require 'erb'
require 'rack/router'
require 'rack/file'
require 'sinatra'
require 'yajl/json_gem'
require 'require_all'

require "#{Dir.pwd}/config/setup.rb"
require_all "#{Dir.pwd}/app/models/"
require_all "#{Dir.pwd}/app/controllers/"

use	Rack::MethodOverride
use Rack::ShowExceptions

use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"  

router = Rack::Router.new(nil) do |r|

  app_configs = {}
  FB_CONFIGS::each { | app_config | app_configs[app_config[1]['name']] = app_config[1]['game_name'] }
  app_configs.each_pair do | app, game_name|
    sub_dirs = Dir.entries(File.join("public", game_name))
    sub_dirs.delete(".")
    sub_dirs.delete("..")
    sub_dirs.each do |sub_dir|
      if File.directory?(File.join("public" , game_name, sub_dir))
        r.map "/fb-games/" + app + "/" + sub_dir, :to => Rack::File.new( File.join("public" , game_name, sub_dir))
      end
    end
  end
  r.map "/nezal-admin", :to => AdminController
  r.map "/fb-games/users", :to => UsersController
  r.map "/fb-games", :to => GamesController
end

run router

