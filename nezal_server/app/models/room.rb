# This class currently responsible for persistance of room db, room_users db
# room db holds the room data 
# room_users db holds the latest event seen by user in this room. It can also 
# be used to get all users in a room
#
# Currently key , value pairs of the tables are as follows :
#
#   Room Data  : room_id ,  { :id -> id }
#   Room_users : room_id + SEPARATOR + user_id , event_id

class Room 
  
  def self.create(user_id)
    #This should save a room object to the db
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    room =  { :id => id }
    $dbs[:rooms].put(nil, room[:id], Marshal.dump(room), 0)
    #This should add a user to the room_users
    self.update(room[:id], user_id)
    room
  end
  
  def self.update(room_id, user_id, event_id = "#{room_id}-") 
    $dbs[:room_users].put(nil, room_id+"-"+user_id, event_id, 0)
  end
  
  def self.get(id)
    room = (record=$dbs[:rooms].get(nil, id, nil, 0)).nil?  ? nil :  Marshal.load(record)
  end

  def self.user_events(room_id, user_id)
    event_id = $dbs[:room_users].get(nil, "#{room_id}-#{user_id}", nil, 0)
    events = Event.after(room_id, user_id, event_id)
    self.update(room_id, user_id, events.last[:id]) unless events.empty? 
    events    
  end

  def self.users(room_id)
    users = {}
    begin
      cursor = $dbs[:room_users].cursor(nil, 0)
      result =  cursor.get("#{room_id}-", nil, Bdb::DB_SET_RANGE)
      while result
        user_id = result[0].split("-")[1]
        user = result[1]
        if result[0].index(room_id)==0
          users[user_id] = user
          result = cursor.get(result[0], nil, Bdb::DB_NEXT)
        else
          break
        end
      end
    rescue 
      #TODO There should be some error handling in here we will see
      RAILS_DEFAULT_LOGGER.debug ">>>>>>>>>>>>>> Exception in Room.User: #{e}"
      cursor.close
    end
    cursor.close
    users
  end
  
  def self.list
    rooms = {}
    begin
      cursor = $dbs[:rooms].cursor(nil, 0)
      result =  cursor.get(nil, nil, Bdb::DB_FIRST)
      while result
        room = Marshal.load(result[1])
        room[:users] = self.users(room[:id])
        rooms [room[:id]] = room
        result = cursor.get(nil, nil, Bdb::DB_NEXT)
      end
    rescue 
      #TODO There should be some error handling in here we will see
      cursor.close
    end
    cursor.close
    rooms
  end

end

=begin
  room = Room.create("1")
  room2 = Room.create("2")
  Room.update(room2[:id], "3", "2")
  Room.update(room2[:id], "4", "3")
  Room.update(room2[:id], "2", "5")
  Room.update(room[:id], "2", "1")
  puts Room.get(room[:id])
  puts Room.get(room2[:id])
  puts Room.users(room2[:id])
  puts Room.users("0")
  puts Room.users(room[:id])
  puts Room.list
=end

