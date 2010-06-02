class StudioController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/studio'

  get '' do 
    puts "Inside get"
    erb :show, { :layout => false}
  end
  
  get '/intro' do 
    puts "Inside get /intro"
    @matches = Match.dataset.all
    erb :studio, { :layout => false}
  end
  
  post '/predictions/:match_id' do
    prediction = Prediction.find(:user_id => @user.user_id, :app_id => @user.app_id, :match_id => params[:match_id]) || 
                  Prediction.create(:user => @user, :match => params[:match_id])
    prediction.goals_a = params['goals_a']
    prediction.goals_b = params['goals_b']
    prediction.kicks_a = params['kicks_a']
    prediction.kicks_b = params['kicks_b']
    prediction.save
  end
  
end
