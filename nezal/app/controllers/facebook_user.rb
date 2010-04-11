require 'mini_fb'

class FacebookUser
  CONFIG ={
    :key => '345228e4699e2112c66ea8855b2ee88c ',
    :secret => 'f764f516364dee05b5a23500cebe137e',
  }

  def self.appUserFriends(session_key, uid)
    user_hash = MiniFB.call(CONFIG[:key], CONFIG[:secret], "facebook.friends.getAppUsers", "session_key" => session_key, "call_id" => true )
    puts "------------ #{user_hash} -------------"
  end
  
  def self.allUserFriends(session_key, uid)
    user_hash = MiniFB.call(CONFIG[:key], CONFIG[:secret], "facebook.friends.get", "session_key" => session_key, "call_id" => true )
    puts "------------ #{user_hash} -------------"
  end

end  

