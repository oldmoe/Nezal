require 'mini_fb'

class FacebookUser
  
  FRIEND_FIELDS = [ "uid", "name", "first_name", "last_name", "pic_small", "profile_url" ]

  def self.appUserFriends(app_id, session_key, uid)
    user_hash = MiniFB.call(FBConfigs::CONFIG[app_id]["key"], FBConfigs::CONFIG[app_id]["secret"], "facebook.friends.getAppUsers", "session_key" => session_key, "call_id" => true )
    self.getUserInfo(app_id, session_key, user_hash)
  end
  
  def self.getUserInfo(app_id, session_key, user_hash)
    MiniFB.call(FBConfigs::CONFIG[app_id]["key"], FBConfigs::CONFIG[app_id]["secret"], "facebook.users.getInfo", "session_key" => session_key,
       "uids" => user_hash.join(","), "fields" => FRIEND_FIELDS.join(","))
  end
  
  def self.allUserFriends(app_id, session_key, uid)
    user_hash = MiniFB.call(FBConfigs::CONFIG[app_id][:key], FBConfigs::CONFIG[app_id][:secret], "facebook.friends.get", "session_key" => session_key, "call_id" => true )
  end

end  
