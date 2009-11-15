class RoomsController < ApplicationController 
      
  def index
    @rooms = $data[:rooms]  
    @rooms
  end  
  
  def create
    @rooms = $data[:rooms]  
    @room = Room.create(user)
    @rooms[@room[:id]] = @room
    puts "====RoomController: Inside Create : Room is #{@room}"
    redirect_to :action => :show, :id => @room[:id]
  end
  
  def show
    @room = $data[:rooms][params[:id]];
    @user = user[:id];
    render :layout => 'room'
  end
  
  def update
    @room = $data[:rooms][params[:id]]    
    @room[:users][user[:id]] = nil unless @room[:users][user[:id]]   
    @user = user[:id];
    render :layout => 'room', :action => :show, :id => @room[:id] 
  end
  
end
