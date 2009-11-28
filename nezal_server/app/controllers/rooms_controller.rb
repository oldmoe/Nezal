class RoomsController < ApplicationController
      
  def index
    @rooms = Room.list
    @rooms
  end  
  
  def create
    @room = Room.create(user[:id])
    @room[:users] = Room.users(@room[:id])
    redirect_to :action => :show, :id => @room[:id]
  end
  
  def show
    @room = Room.get(params[:id])
    @room[:users] =  Room.users(@room[:id])
    @user = user[:id]
    render :layout => 'room'
  end
  
  def update
    Room.addUser(params[:id], user[:id])
    @room = Room.get(params[:id])
    @room[:users] =  Room.users(@room[:id]) 
    @user = user[:id]
    render :layout => 'room', :action => :show, :id => @room[:id] 
  end
  
end
