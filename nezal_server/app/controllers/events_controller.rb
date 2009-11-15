class EventsController < ApplicationController

  attr_accessor :room

  before_filter { |c|
    c.room = $data[:rooms][c.params[:room_id]]  
  }

  def index
    puts "**** User : #{@room[:users][user[:id]]}"
    @events = if (last_event = @room[:users][user[:id]])
      event = @room[:events].fetch(last_event)
      result = []
      while (event = event[:next])       
        result << event[:value] unless event[:value][:user][:id]==user[:id]
      end
      result
    else
      @room[:events].values
    end
    last_event = @room[:users].delete(user[:id])
    @room[:users][user[:id]] = @events.last[:id] rescue last_event
    response.headers['X-JSON'] = @events.to_json()
    render :nothing => true
  end
  
  def create
    @event = Event.create(params[:data], user)
    puts "==== Inside Create : Event is #{@event}"
    @room[:events][@event[:id]] = @event
    response.headers['X-JSON'] = @event.to_json()
#      response['content_type'] = 'JSON'
    render :nothing => true #:json => @event.to_json()#:layout=>false, :show=>false
  end  
  
end

