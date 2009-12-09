class TestController < ApplicationController
  register Sinatra::Async

=begin
  get '' do
    room_id = "4gtgnf9w8"
    @events = Room.user_events(room_id, user[:id])
    response.headers['X-JSON'] = @events.to_json()
  end
=end

=begin
  get '' do 
    "hi"
  end
=end

  aget '' do 
    room_id = "4gtgnf9w8"
    fetch = Proc.new {
      @events = Room.user_events(room_id, user[:id])
      response.headers['X-JSON'] = @events.to_json()
      body { '' }
    }
    EM.add_timer(0.01) {  
      fetch.call
    }
  end
  
end
