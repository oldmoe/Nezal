class Event

  def self.create(data, room_id, user_id)
    id = room_id + (Time.now.to_f * 10000).to_i.to_s(36)
    event =  { :id => id, :data => data, :user => user_id }
    $dbs[:events].put(nil, event[:id], Marshal.dump(event), 0)
    event
  end

  def self.get(id)
    event = (record=$dbs[:events].get(nil, id, nil, 0)).nil?  ? nil :  Marshal.load(record)
  end

  def self.roomEventsAfter(room_id, event_id, user_id)
    events = []
    begin
      cursor = $dbs[:events].cursor(nil, 0)
      puts cursor
      result =  cursor.get(event_id, nil, Bdb::DB_SET_RANGE)
      event = Marshal.load(result[1])
      if event[:id]==event_id
        result = cursor.get(event[:id], nil, Bdb::DB_NEXT) 
        event = Marshal.load(result[1])
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
    rescue
      #TODO There should be some error handling in here we will see
      cursor.close
    end
    cursor.close
    events
  end
  
end 

=begin
event = Event.create("helllo", "1", {:id=> "10"})
puts Event.get(event[:id])
event = Event.create("helllo", "1", {:id=> "10"})
puts Event.get(event[:id])
event = Event.create("helllo", "1", {:id=> "10"})
puts Event.get(event[:id])
event1 = Event.create("helllo", "1", {:id=> "10"})
puts 
puts Event.get(event1[:id])
puts 
event = Event.create("helllo", "2", {:id=> "10"})
puts Event.get(event[:id])
event = Event.create("helllo", "2", {:id=> "10"})
puts Event.get(event[:id])
event = Event.create("helllo", "1", {:id=> "10"})
puts Event.get(event[:id])
event = Event.create("helllo", "1", {:id=> "10"})
puts Event.get(event[:id])

puts Event.roomEventsAfter( "1", "14glhx9afh")

Kernel.at_exit {
  $dbs.each_value do |value|
    value.close(0)
  end
  $env.close 
}
=end

