class CourtsController < ApplicationController 
  
  set :views, ::File.dirname(::File.dirname(__FILE__)) +  '/views/courts'
  
  get '' do 
    @game_id = env['rack_router.params'][:game_id]
    @courts = Court.list(@game_id)
    @court = @courts[0] if @courts
    CourtJoiner.new(@court[:key], @user[:key])
    erb :show , {:layout => :app}
  end
  
  put '/:id' do 
    if(params[:_action] == 'add')
      puts "Adding User to court"
      CourtJoiner.new(params[:id], @user[:key])
      @court = Court.find(params[:id])
      @court[:users] =  CourtJoiner.joiners(@court[:key]) 
#      redirect "/rooms/#{@court[:key]}" 
    else 
      puts "Deleting User from court"
      CourtJoiner.del_user(params[:id], @user[:key])
    end
  end

  
end
