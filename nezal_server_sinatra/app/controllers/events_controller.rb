require 'json'

class EventsController < ApplicationController
  register Sinatra::Async

  set :views, File.dirname(File.dirname(__FILE__)) +  '/views/events'
  attr_accessor :room

  before do
    @room = {:id => params[:room_id]}
  end

=begin
  get '' do
    room_id = env['rack_router.params'][:room_id] 
    @events = Room.user_events(room_id, user[:id])
    response.headers['X-JSON'] = @events.to_json()
    return
  end
=end

  aget '' do 
    room_id = env['rack_router.params'][:room_id] 
    room_id = "4gtgnf9w8"
    timeout = 0
    fetch = Proc.new {
      timeout +=1
      @events = Room.user_events(room_id, user[:id])
      if @events.empty? && timeout < 10
        EM.add_timer(0.10){ fetch.call }
      else
        response.headers['X-JSON'] = @events.to_json()
        body { '' }
      end
    }
    EM.add_timer(0.001) {  
      fetch.call
    }
  end
  
  post '' do
    puts "inside post" 
    room_id = env['rack_router.params'][:room_id] 
    @event = Event.create(room_id, user[:id], params[:type],  params[:data]) 
    response.headers['X-JSON'] = @event.to_json()
    return
  end
    
  def create
    @event = Event.create(params[:room_id], user[:id], params[:type],  params[:data]) 
    response.headers['X-JSON'] = @event.to_json()
    render :nothing => true #:json => @event.to_json()#:layout=>false, :show=>false
  end  
  
end

