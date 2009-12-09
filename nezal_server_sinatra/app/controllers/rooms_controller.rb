class RoomsController < ApplicationController
  
  set :views, File.dirname(File.dirname(__FILE__)) +  '/views/rooms'
  
  get '' do 
    @rooms = Room.list
    @rooms
    erb :index , {:layout => :application}
  end
  
  post '' do
    puts "inside post" 
    @room = Room.create(user[:id])
    @room[:users] = Room.users(@room[:id])
    redirect "/rooms/#{@room[:id]}"
  end
  
  get '/:id' do 
    @room = Room.get(params[:id])
    @room[:users] =  Room.users(@room[:id])
    @user = user[:id]
    erb :show
  end
  
  put '/:id' do 
    puts "inside put"
    puts @user[:id]
    if(params[:_action] == 'add')
      Room.addUser(params[:id], @user[:id])
      @room = Room.get(params[:id])
      @room[:users] =  Room.users(@room[:id]) 
      @user = @user[:id]
      redirect "/rooms/#{@room[:id]}" 
    else 
      puts "Inside Else"
      Room.delUser(params[:id], user[:id])
    end
  end
  
  def update
    if(params[:_action] == 'add')
      Room.addUser(params[:id], user[:id])
      @room = Room.get(params[:id])
      @room[:users] =  Room.users(@room[:id]) 
      @user = user[:id]
      render :layout => 'room', :action => :show, :id => @room[:id] 
    else 
      Room.delUser(params[:id], user[:id])
      render :nothing => true
    end
  end
  
end
