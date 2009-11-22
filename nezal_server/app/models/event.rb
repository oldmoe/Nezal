# This class currently responsible for persistance of room_events db
# room_events db holds the latest events sent by rooms users
#
# Currently key , value pairs of the tables are as follows :
#
#   Events  : room_id + SEPARATOR + event_id , { :id => id, :data => data, :user => user_id }

class Event
  
  SEPARATOR = "-"

  def self.create(data, room_id, user_id)
    id = room_id + SEPARATOR + (Time.now.to_f * 10000).to_i.to_s(36)
    event =  { :id => id, :data => data, :user => user_id }
    $dbs[:events].put(nil, event[:id], Marshal.dump(event), 0)
    self.clean(room_id)
    event
  end

  def self.get(id)
    event = (record=$dbs[:events].get(nil, id, nil, 0)).nil?  ? nil :  Marshal.load(record)
  end

  def self.after(room_id, user_id, event_id)
    RAILS_DEFAULT_LOGGER.debug ">>>>>>>>>>> after (#{event_id})"
    events = []
    begin
      cursor = $dbs[:events].cursor(nil, 0)
      result =  cursor.get(event_id, nil, Bdb::DB_SET_RANGE)
      event = Marshal.load(result[1])
      if event[:id]==event_id
        result = cursor.get(event[:id], nil, Bdb::DB_NEXT) 
      end
      while result
        event = Marshal.load(result[1])
        if event[:id].index(room_id)==0
          events << event unless event[:user] == user_id
          result = cursor.get(event[:id], nil, Bdb::DB_NEXT)
        else 
          break
        end
      end
    rescue Exception => e
      #TODO There should be some error handling in here we will see
      RAILS_DEFAULT_LOGGER.debug ">>>>>>>>>>> Exception in Event.after #{e} "
      cursor.close
    end
    cursor.close
    events
  end
  
  def self.clean(room_id)
    users =  Room.users(room_id)
    users_events = users.values
    RAILS_DEFAULT_LOGGER.debug ">>>>>>>>>>>--------- Event.clean, users_events = #{users_events}"
    event_id = (users_events.sort).last
    begin
      cursor = $dbs[:events].cursor(nil, 0)
      result =  cursor.get(event_id, nil, Bdb::DB_SET_RANGE)
      event = Marshal.load(result[1])
      if event[:id].index(room_id)==0
          result = cursor.get(event[:id], nil, Bdb::DB_PREV)
      end
      while result
        event = Marshal.load(result[1])
        if event[:id].index(room_id)==0
          $dbs[:events].del(nil, event[:id], 0)
          result = cursor.get(event[:id], nil, Bdb::DB_PREV)
        else 
          break
        end
      end
    rescue Exception => e 
      #TODO There should be some error handling in here we will see
      RAILS_DEFAULT_LOGGER.debug ">>>>>>>>>>> Exception in  Event.clean #{e}"
      cursor.close
    end
    cursor.close
  end
  
end 

=begin
  require 'bdb'
  require 'yaml'

  if($load.nil?)
    $load = "test"
    $config = YAML.load_file( "/home/riham/github/Nezal/nezal_server" + "/config/bdb.yml")  #rescue nil || {}
    $dbs = { :rooms => nil, :room_users => nil, :events => nil }
    $env = Bdb::Env.new(0)
    $env_flags =  Bdb::DB_CREATE |    # Create the environment if it does not already exist.
      Bdb::DB_INIT_TXN  | # Initialize transactions
      Bdb::DB_INIT_MPOOL| # Initialize the in-memory cache.
      Bdb::DB_INIT_LOCK   # Initialize locking.
    $env.open(File.join($config["store_path"], $config["env_name"]), $env_flags, 0);
    $dbs[:rooms] = $env.db
    $dbs[:rooms].open(nil, self.class.name, nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
    $dbs[:room_users] = $env.db
    $dbs[:room_users].open(nil, 'Room_User', nil, Bdb::Db::BTREE, Bdb::DB_CREATE , 0)
    $dbs[:events] = $env.db
    $dbs[:events].open(nil, 'Events', nil, Bdb::Db::BTREE, Bdb::DB_CREATE, 0)
    Kernel.at_exit {
      $dbs.each_value do |value|
        value.close(0)
      end
      $env.close 
    }
  end
=end  

=begin
  event = Event.create("helllo", "1", "10")
  puts Event.get(event[:id])
  event = Event.create("helllo", "1", "10")
  puts Event.get(event[:id])
  event = Event.create("helllo", "1", "10")
  puts Event.get(event[:id])

  event1 = Event.create("helllo", "1", "10")
  puts 
  puts Event.get(event1[:id])
  puts 
  
  event = Event.create("helllo", "2", "10")
  puts Event.get(event[:id])
  event = Event.create("helllo", "2", "10")
  puts Event.get(event[:id])
  event = Event.create("helllo", "1", "11")
  puts Event.get(event[:id])
  event = Event.create("helllo", "1", "11")
  puts Event.get(event[:id])

  puts
  puts Event.roomEventsAfter( "1", nil, "13")
  puts

  Event.deleteEventsBefore("1", event1[:id])
  
  puts Event.roomEventsAfter( "1", "1", "13")
 
=end

