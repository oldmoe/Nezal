class EventsController < ApplicationController

  attr_accessor :room

  before_filter { |c|
    c.room = Room.get(c.params[:room_id])
    c.room[:users] =  Room.users(c.room[:id]) 
  }

  def index
    @events = Event.roomEventsAfter(@room[:id], @room[:users][user[:id]][:event], user[:id])    
    Room.update(@room[:id], user[:id], @events.last[:id] ) unless @events.last.nil?
    response.headers['X-JSON'] = @events.to_json()
    render :nothing => true
  end
  
  def create
    @event = Event.create(params[:data], @room[:id], user[:id])
    response.headers['X-JSON'] = @event.to_json()
#      response['content_type'] = 'JSON'
    render :nothing => true #:json => @event.to_json()#:layout=>false, :show=>false
  end  
  
end

