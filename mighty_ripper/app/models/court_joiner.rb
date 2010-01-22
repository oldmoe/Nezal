class CourtJoiner 
  include Bdb::Persistable
  
  SEPARATOR = '-'
  
  def initialize(court_id, user_id)
    key = court_id + SEPARATOR + user_id
    court_user = self.class.create({:key => key, :value => "#{court_id}-"})
    Event.new(court_id, user_id, Event::TYPE[:room], "Join")
    court_user
  end
  
  def self.del_user(court_id, user_id)
#    self.destroy(court_id + SEPARATOR + user_id)
    Event.new(court_id, user_id, Event::TYPE[:room], "Leave")
  end
  
  def self.update(court_id, user_id, event_id = "#{room_id}-") 
    self.create( { :key => court_id + SEPARATOR + user_id, :value => event_id } )
  end
  
  def self.joiner_events(court_id, user_id)
    event = self.find( court_id + SEPARATOR + user_id )
    events = Event.after(court_id, user_id, event[:value]) 
    self.update(court_id, user_id, events.last[:key]) unless events.empty? 
    result = [] 
    events.each {|event| result << event[:value]}
    result
  end

  def self.joiners(court_id)
    users = {}
    begin
      cursor = @@db_handler.cursor(nil, 0)
      result =  cursor.get(court_id + SEPARATOR, nil, Bdb::DB_SET_RANGE)
      while result
        user_id = result[0].split(SEPARATOR)[2]
        if result[0].index(court_id)==0
          user = restore(result[1])
          users[user_id] = user
          result = cursor.get(result[0], nil, Bdb::DB_NEXT)
        else
          break
        end
      end
    rescue 
      #TODO There should be some error handling in here we will see
      puts ">>>>>>>>>>>>>> Exception in CourtJoiners.User: #{e}"
      cursor.close
    end
    cursor.close
    users
  end
  
end
