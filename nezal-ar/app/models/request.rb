# Each record should hold the requests a user has made.
# key : user key.
# data : hash of requests. 
#        requests : { request_key => { :to => user_key, :timestamp => Time request was issued, :data => {} } ,
#                     request2_key => {} .. etc }
class Request < DataStore::Model

  TIMEOUT = 60*60*2*24
  EXCLUDE_TIME = 60*60*24

  @@data = { "requests" => {} }
  
  def init
    @data ||= { "requests" => {} }
  end

  def excluded_friends 
    ids = []
    time = Time.now.to_i
    requests.each do |id, request|
      if time - request['timestamp'] < EXCLUDE_TIME
        ids << request['to']
      end
    end
    ids
  end

  def get_friend_request friend_key, request_id
    friend_request = requests[request_id]
    if friend_request && friend_request['to'] == friend_key
      return friend_request      
    end
  end
  
  def process friend_key, request_id
    request = get_friend_request friend_key, request_id
    if request && request['timestamp'] + TIMEOUT > Time.now.to_i
      Game::current.process_service_request(key, request)
      requests.delete(request_id)
      save
    end   
  end

end
