require 'json'

class EventsController < ApplicationController

  set :views, File.dirname(File.dirname(__FILE__)) +  '/views/events'
  attr_accessor :court

  before do
    @court = {:key => params[:court_id]}
  end

  get '' do
    court_id = env['rack_router.params'][:court_id] 
    @events = CourtJoiner.joiner_events(court_id, user[:key])
    response.headers['X-JSON'] = @events.to_json()
    return
  end
  
  post '' do
    court_id = env['rack_router.params'][:court_id] 
    @event = Event.new(court_id, user[:key], params[:type],  params[:data]).event 
    response.headers['X-JSON'] = @event[:value].to_json()
    return
  end
    
  def create
    @event = Event.new(params[:court_id], user[:key], params[:type],  params[:data]) 
    response.headers['X-JSON'] = @event[:value].to_json()
    render :nothing => true #:json => @event.to_json()#:layout=>false, :show=>false
  end  
  
end

