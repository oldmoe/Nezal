require 'mini_fb'

class FacebookUser
  CONFIG ={
    :key => '345228e4699e2112c66ea8855b2ee88c ',
    :secret => 'f764f516364dee05b5a23500cebe137e',
  }
  FRIEND_FIELDS = [ "uid", "name", "first_name", "last_name", "pic_small", "profile_url" ]

  def self.appUserFriends(session_key, uid)
    user_hash = MiniFB.call(CONFIG[:key], CONFIG[:secret], "facebook.friends.getAppUsers", "session_key" => session_key, "call_id" => true )
    MiniFB.call(CONFIG[:key], CONFIG[:secret], "facebook.users.getInfo", "session_key" => session_key,
         "uids" => user_hash.join(","), "fields" => FRIEND_FIELDS.join(","))
  end
  
  def self.allUserFriends(session_key, uid)
    user_hash = MiniFB.call(CONFIG[:key], CONFIG[:secret], "facebook.friends.get", "session_key" => session_key, "call_id" => true )
  end

end  

