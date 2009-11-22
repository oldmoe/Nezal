class EventsController < ApplicationController

  attr_accessor :room

  before_filter { |c|
    c.room = {:id => c.params[:room_id]}
  }

  def index
    @events = Room.user_events(params[:room_id], user[:id])
    response.headers['X-JSON'] = @events.to_json()
    render :nothing => true
  end
  
  def create
    @event = Event.create(params[:data], params[:room_id], user[:id])
    response.headers['X-JSON'] = @event.to_json()
    render :nothing => true #:json => @event.to_json()#:layout=>false, :show=>false
  end  
  
end

