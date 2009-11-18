require 'bdb'
require 'yaml'

# There should be some initialization for the environment. Not quite sure to put it
# Perhaps a separate file for the database initialization  
if($load.nil?)
  $load = "test"
  $config = YAML.load_file(Dir.pwd + "/config/bdb.yml")  #rescue nil || {}
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

class Room 
  
  def self.create(user_id)
    #This should save a room object to the db
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    room =  { :id => id }
    $dbs[:rooms].put(nil, room[:id], Marshal.dump(room), 0)
    #This should add a user to the room_users
    self.update(room[:id], user_id, nil)
    room
  end
  
  def self.update(room_id, user_id, event_id)    
    $dbs[:room_users].put(nil, room_id+"-"+user_id, Marshal.dump( { :event => event_id }), 0)
  end
  
  def self.get(id)
    room = (record=$dbs[:rooms].get(nil, id, nil, 0)).nil?  ? nil :  Marshal.load(record)
  end

  def self.users(room_id)
    users = {}
    begin
      cursor = $dbs[:room_users].cursor(nil, 0)
      result =  cursor.get(room_id+"-", nil, Bdb::DB_SET_RANGE)
      while result
        user_id = result[0].split("-")[1]
        user = Marshal.load(result[1])
        if result[0].index(room_id)==0
          users[user_id] = user
          result = cursor.get(result[0], nil, Bdb::DB_NEXT)
        else
          break
        end
      end
    rescue 
      #TODO There should be some error handling in here we will see
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

