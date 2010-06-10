require 'json'

class StudioController < ApplicationController 
  
  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/studio'
  
  get '' do 
    redirect env['SCRIPT_NAME']+'/index.html'
  end
  
  get '/intro' do 
    puts "Inside get /intro"
    @user.test(@fb_session_key)
    @matches = Match.dataset.all
    erb :studio, { :layout => false}
  end
  
  get '/matches' do
    { :round => Group.dataset.all ,:matches => Match.dataset.all , :teams => Team.dataset.all, :locations => Location.dataset.all }.to_json
  end

  get '/matches/:id' do
    match = Match[params[:id]]
      { 	
	    :match => match, :teamA => match.team_a, :teamB => match.team_b, :status => match.status, 
	    :kicks => match.accept_kicks?, :remaining => match.remaining, 
      :prediction => Prediction.filter(:user_id => @user.user_id, :app_id => @user.app_id, :match_id => match.id)
    }.to_json
  end
	
  get '/ranking/:round' do 
    round = params["round"].to_sym
    response = {:global_top_scorers => [], :friends_top_scorers => [], :global_ranking => [], :friends_ranking => [] }

    @top_scorers = @user.global_top_scorers( round )
    @friends_top_scorers = @user.friends_top_scorers(round)
    @global_ranking = @user.global_ranking(round)
    @friends_ranking = @user.among_friends_ranking(round)
    
    @top_scorers.each_index do | user |
      hash = dump_user(@top_scorers[user], round)
      hash["order"] = user + 1
      response[:global_top_scorers] << hash
    end
        
    @friends_top_scorers.each_index do | user |
      hash = dump_user(@friends_top_scorers[user], round)
      hash["order"] = user + 1
      response[:friends_top_scorers] << hash
    end
    
    list_length =  @global_ranking[:previous].length
    @global_ranking[:previous].each_index do | user |
      hash = dump_user(@global_ranking[:previous][user], round)
      hash["order"] = @global_ranking[:rank] - list_length + user
      response[:global_ranking] << hash
    end
    hash = dump_user(@user, round)
    hash["order"] = @global_ranking[:rank]
    response[:global_ranking] << hash
    list_length =  @global_ranking[:next].length
    @global_ranking[:next].each_index do | user |
      hash = dump_user(@global_ranking[:next][user], round)
      hash["order"] = @global_ranking[:rank] + user + 1
      response[:global_ranking] << hash
    end

    list_length =  @friends_ranking[:previous].length    
    @friends_ranking[:previous].each_index do | user |
      hash = dump_user(@friends_ranking[:previous][user], round) 
      hash["order"] = @friends_ranking[:rank] - list_length + user
      response[:friends_ranking] << hash
    end
    hash = dump_user(@user, round)
    hash["order"] = @friends_ranking[:rank]
    response[:friends_ranking] << hash
    list_length =  @friends_ranking[:next].length
    @friends_ranking[:next].each_index do | user |
      hash = dump_user(@friends_ranking[:next][user], round)
      hash["order"] = @friends_ranking[:rank] + user + 1
      response[:friends_ranking] << hash
    end
    response.to_json
  end
  
  post '/predictions/:match_id' do
    prediction = Prediction.find(:user_id => @user.user_id, :app_id => @user.app_id, :match_id => params[:match_id]) || 
                                  Prediction.new(:user => @user, :match_id => params[:match_id])
    prediction.goals_a = params['goals_a']
    prediction.goals_b = params['goals_b']
    prediction.kicks_a = params['kicks_a']
    prediction.kicks_b = params['kicks_b']
    if prediction.acceptable?
      p prediction.save
    else
      p prediction.errors
    end
  end
  
  def dump_user(user, round)
    result = {}
    result["id"] = user[:user_id]
    result["name"] = user.user_info(@user.session)['first_name']
    result["pic"] = user.user_info(@user.session)['pic_big']
    result["score"] = user[round]
    result["profile_url"] = user.user_info(@user.session)['profile_url']
    result["me"] = if user[:user_id] == @user[:user_id]
                    true 
                  else
                    false
                  end
    result
  end
  
end
