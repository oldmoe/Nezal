class GamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/games'
  
  get '/:game_name' do 
    erb :index , {:layout => :app}
#    File.read(File.join('public/city-defender', 'index.html'))
  end
  
  get '/admin/new' do
    erb :new , {:layout => :app}
  end
    
  post '/admin' do
    @game = Game.new(params)
    @game.save
    redirect "/games"
  end
  
end







