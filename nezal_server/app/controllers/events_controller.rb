class EventsController < ApplicationController

  before_filter do
    @room = $data[:rooms][params[:room_id]]  
  end

  def index
    @events = if (last_event = @room[:users][user[:id]])
      event = @room[:events][last_event]
      result = []
      while nextEvent = event.next
        result << nextEvent[:value]
      end
      result
    else
      @room[:events].values
    end
    last_event = @room[:users].delete(user[:id])
    @room[:users][user[:id]] = @events.last[:id] resuce last_event
  end
  
  def create
  end  
  
end
