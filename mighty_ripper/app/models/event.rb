# This class currently responsible for persistance of room_events db
# room_events db holds the latest events sent by rooms users
#
# Currently key , value pairs of the tables are as follows :
#
#   Events  : room_id + SEPARATOR + event_id , {:data => data, :user => user_id, :type => type }

class Event
  include Bdb::Persistable
  
  attr_reader :event
  
  SEPARATOR = "-"
  TYPE = {:game => 'game', :chat => 'chat', :room => 'room'}
  
  def initialize(court_id, user_id, type, data)
    self.class.clean(court_id)
    key = court_id + SEPARATOR + self.class.generate_key
    event = { :key => key, :value => {:data => data, :user => user_id, :type => type}}
    @event = self.class.create(event)
  end

  def self.after(court_id, user_id, event_id)
    events = []
    begin
      cursor = @@db_handler.cursor(nil, 0)
      result =  cursor.get(event_id, nil, Bdb::DB_SET_RANGE)
      if result && result[0]==event_id
        result = cursor.get(result[0], nil, Bdb::DB_NEXT) 
      end
      while result
        if result[0].index(court_id)==0
          event = { :key => result[0], :value => restore(result[1]) }
          events << event unless event[:value][:user] == user_id
          result = cursor.get(result[0], nil, Bdb::DB_NEXT)
        else 
          break
        end
      end
    rescue Exception => e
      #TODO There should be some error handling in here we will see
      puts ">>>>>>>>>>> Exception in Event.after #{e}"
      cursor.close
    end
    cursor.close
    events
  end

  def self.clean(court_id)
    users =  CourtJoiner.joiners(court_id)
    users_events = users.values
    event_id = (users_events.sort).last
    begin
      cursor = @@db_handler.cursor(nil, 0)
      result =  cursor.get(event_id, nil, Bdb::DB_SET_RANGE)
      if result && result[0].index(court_id)==0
          result = cursor.get(result[0], nil, Bdb::DB_PREV)
      end
      while result 
        event = self.restore(result[1])
        if result[0].index(court_id)==0
          destroy(result[0])
          result = cursor.get(event[:id], nil, Bdb::DB_PREV)
        else 
          break
        end
      end
    rescue Exception => e 
      #TODO There should be some error handling in here we will see
      puts ">>>>>>>>>>> Exception in  Event.clean #{e}"
      cursor.close
    end
    cursor.close
  end
  
end 
