class RoomsController < ApplicationController 
    
  def index
    @rooms = $data[:rooms]
  end  
  
  def create
    @room = Room.create(user)
    render :action => :show, :id => @room[:id] 
  end
  
  def show
    @room = $data[:rooms][params[:id]]
  end
  
  def update
    @room = $data[:rooms][params[:id]]    
    @room[:users][user[:id]] => nil unless @room[:users][user[:id]]   
  end
  
end
