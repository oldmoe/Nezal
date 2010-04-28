class FBUsersController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/facebook/games'
  
  get '/add' do 
    puts "-------- Inside Add"
    puts session
    puts "-------------------"
  end
  
  get '/remove' do
    puts "-------- Inside Remove"
    puts session
    puts "-------------------"
  end
  
end


