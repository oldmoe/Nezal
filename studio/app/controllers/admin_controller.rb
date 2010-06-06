require 'date'

class AdminController < ApplicationController 
  
  ADMIN_URL = "studio-admin"

  enable :sessions
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/admin'

  get '' do 
    @display = {:groups => false, :teams => false, :locations => false, :matches => false}
    if env["HTTP_REFERER"]
      uri =  env["HTTP_REFERER"].split(ADMIN_URL)[1]
      case uri
        when  /^\/groups/
          @display[:groups] = true
        when /^\/teams/
          @display[:teams] = true
        when /^\/locations/
          @display[:locations] = true
        when /^\/matches/
          @display[:matches] = true
        when nil
          @display[:groups] = true
      end
    else
      @display[:groups] = true
    end
    @groups = Group.dataset.all
    @teams = Team.dataset.all
    @locations = Location.dataset.all
    @matches = Match.dataset.all
    erb :main , {:layout => :layout}
  end
  
  get '/groups/new' do
    erb 'groups/new'.to_sym , {:layout => :layout}
  end

  get '/teams/new' do
    @groups = Group.dataset.all
    erb 'teams/edit'.to_sym , {:layout => :layout}
  end

  get '/locations/new' do
    @groups = Group.dataset.all
    erb 'locations/edit'.to_sym , {:layout => :layout}
  end
  
  get '/matches/new' do
    @groups = Group.dataset.all
    @teams = Team.dataset.all
    @locations = Location.dataset.all
    erb 'matches/edit'.to_sym , {:layout => :layout}
  end

# VIEW OPERATIONS 
  get '/groups/:id' do
    @group = Group.find :id => params[:id]
    erb 'groups/show'.to_sym , {:layout => :layout}
  end
  
  get '/teams/:id' do 
    @team = Team.find :id => params[:id]
    @groups = Group.dataset.all
    erb 'teams/edit'.to_sym , {:layout => :layout}
  end
  
  get '/locations/:id' do 
    @location = Location.find :id => params[:id]
    erb 'locations/edit'.to_sym , {:layout => :layout}
  end

  get '/matches/:id' do 
    @match = Match.find :id => params[:id]
    @groups = Group.dataset.all
    @teams = Team.dataset.all
    @locations = Location.dataset.all
    erb 'matches/edit'.to_sym , {:layout => :layout}
  end

# ADD/EDIT OPERATIONS 
  # Add new group
  post '/groups' do
    Group.create(values = {:name => params["name"]})
    redirect "/#{ADMIN_URL}"
  end

  # Add new team 
  post '/teams' do
    Team.create(values = {:name => params["name"], :name_ar => params["name_ar"], :abrv => params["abrv"] ,
                           :ranking => params["ranking"], :info => params["info"], :youtube_url => params["youtube_url"] } )
    redirect "/#{ADMIN_URL}"
  end

  # Edit existing team 
  post '/teams/:id' do
    team = Team.find(:id => params[:id])
    team.name = params["name"]
    team.name_ar = params["name_ar"]
    team.abrv = params["abrv"]
    team.info = params["info"]
    team.ranking = params["ranking"].to_i
    team.youtube_url = params["youtube_url"]
    team.save
    redirect "/#{ADMIN_URL}"
  end

  # Add new location
  post '/locations' do
    Location.create(values = {:name => params["name"], :name_ar => params[:name_ar], :city_name => params["city_name"],
                                   :city_name_ar=> params[:city_name_ar]} )
    redirect "/#{ADMIN_URL}"
  end

  # Edit existing location
  post '/locations/:id' do
    location = Location.find(:id => params[:id])
    location.name = params["name"]
    location.name_ar = params["name_ar"]
    location.city_name = params["city_name"]
    location.city_name_ar = params["city_name_ar"]
    location.save
    redirect "/#{ADMIN_URL}"
  end
  
  # Add new match
  post '/matches' do
    t = Time.parse(params["month"] + " " + params["day"] + " " + params["hour"] + ":" + params["min"]) 
    puts t
    Match.create(values = {:team_a_id => params["team_a"], :team_b_id => params["team_b"],
                 :location_id => params[:location], :group_id => params[:group] , :start_time => t, :youtube_url => params["youtube_url"] } )
    redirect "/#{ADMIN_URL}"
  end

  # Edit existing match
  post '/matches/:id' do
    t = Time.parse(params["month"] + " " + params["day"] + " " + params["hour"] + ":" + params["min"]) 
    puts t
    match = Match.find(:id => params[:id])
    match.team_a_id = params["team_a"]
    match.team_b_id = params["team_b"]
    match.group_id = params["group"]
    match.location_id = params["location"]
    match.start_time = t
    match.goals_a= params["goals_a"]
    match.goals_b= params["goals_b"]
    match.kicks_a= params["kicks_a"]
    match.kicks_b= params["kicks_b"]
    match.youtube_url = params["youtube_url"]
    match.save
    redirect "/#{ADMIN_URL}"
  end

# DELETE OPERATIONS 
  # Delete a group
  put '/groups/:group_id' do
    group = Group.find :id => params[:group_id]
    group.destroy
    redirect "/#{ADMIN_URL}"
  end

  # Delete a team
  put '/teams/:team_id' do
    team = Team.find :id => params[:team_id]
    team.delete
    redirect "/#{ADMIN_URL}"
  end

  # Delete a location
  put '/locations/:id' do
    location = Location.find :id => params[:id]
    location.delete
    redirect "/#{ADMIN_URL}"
  end
  
  # Delete a location
  put '/matches/:id' do
    location = Match.find :id => params[:id]
    location.delete
    redirect "/#{ADMIN_URL}"
  end
  
end
