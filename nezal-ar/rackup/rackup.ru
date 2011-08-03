require 'erb'
require 'rack/file'
require 'sinatra'
require 'yajl/json_gem'
require 'require_all'

require "#{Dir.pwd}/config/setup.rb"
require_all "#{Dir.pwd}/app/models/"
require_all "#{Dir.pwd}/app/controllers/"
require_all "#{Dir.pwd}/lib/language_manager"

Yajl::Encoder.enable_json_gem_compatability

use	Rack::MethodOverride

use Rack::Static, :urls => [ "/stylesheets", "/javascripts", "/favicon.ico", "/game_images", "/html/facebook"], :root => "public"  

app = Rack::Builder.new do
  app_configs = {}
  FB_CONFIGS::each { | app_config | app_configs[app_config[1]['name']] = app_config[1]['game_name'] }
  app_configs.each_pair do | app, game_name|
    sub_dirs = Dir.entries( ::File.join("public", game_name))
    sub_dirs.delete(".")
    sub_dirs.delete("..")
    sub_dirs.each do |sub_dir|
      if ::File.directory?(::File.join("public" , game_name, sub_dir))
        map "/fb-games/" + app + "/" + sub_dir do
          run Rack::File.new( ::File.join("public" , game_name, sub_dir))
        end
        map "/k-games/" + app + "/" + sub_dir do
          run Rack::File.new( ::File.join("public" , game_name, sub_dir))  
        end
        map "/" + app + "/" + sub_dir do
          run Rack::File.new( ::File.join("public" , game_name, sub_dir))
        end
      end
    end
  end
  map "/fb-games" do run GamesController end
  map "/k-games" do run GamesController end
  map "/nezal-admin" do run AdminController end
  map "/fb-games/users" do run UsersController end
end

run app
