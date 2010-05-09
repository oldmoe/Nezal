$request_timers = {}
$current_req = nil

class RequestTimer

  attr_accessor :times

  def initialize 
    @times = { :erb => { :total => 0, :start => [] } , :db =>  { :total => 0, :in_query => false, :start => [] },
               :total =>  { :total => 0, :start => [] }  }
  end

  def start(operation)
    @times[operation][:start] << Time.now
  end
  
  def done(operation)
    @times[operation][:total] += ( Time.now - @times[operation][:start].pop )
  end

end

module Sinatra

  class Base
  
    def erb(template, options={}, locals={})
      $current_req.start(:erb)
      result = super(template, options, locals)
      $current_req.done(:erb)
      result
    end
  
  end
  
end

module DataStore

  class QueryProxy
    
    alias :original_execute :execute
    
    def execute
      $current_req.start(:db)
      $current_req.times[:db][:in_query] = true
      original_execute()
      $current_req.times[:db][:in_query] = false
      $current_req.done(:db)
    end

  end

end

module DataStore 

  module CRUD
  
    alias :original_get :get
    
    def get(id)
      $current_req.start(:db) unless $current_req.times[:db][:in_query]
      record = original_get(id)
      $current_req.done(:db) unless $current_req.times[:db][:in_query]
      record
    end
  
  end
  
end

class NB::RackConnection

  alias :original_upstream :upstream
  
  def upstream
    req = RequestTimer.new()
    $current_req = req
    $request_timers[req.object_id] = req
    req.start(:total)
    original_upstream                  
    req.done(:total)
    $request_timers.delete(req.object_id)
    LOGGER.debug "Request Total : #{req.times[:total][:total]}, Erb : #{req.times[:erb][:total]}, DB : #{req.times[:db][:total]}"
  end

end
