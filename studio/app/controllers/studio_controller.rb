class StudioController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/studio'

  get '' do 
    puts "Inside get"
    erb :show, { :layout => false}
  end
  
end
