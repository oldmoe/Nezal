class GamesController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/games'
  
  get '' do 
    @games = Game.list
    erb :index , {:layout => :app}
  end
  
  get '/:id' do 
  end
  
  get '/admin/new' do
    erb :new , {:layout => :app}
  end
    
  post '/admin' do
    puts "Inside post"
    @game = Game.new(params[:name], params[:description], params[:image])
    redirect "/games"
  end
  
  put  '/:id' do
  end
  
end
