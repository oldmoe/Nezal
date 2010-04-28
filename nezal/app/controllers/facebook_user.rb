require 'mini_fb'

class FacebookUser
  
  FRIEND_FIELDS = [ "uid", "name", "first_name", "last_name", "pic_small", "profile_url" ]

  def self.appUserFriends(app_id, session_key, uid)
    begin
      user_hash = MiniFB.call(FBConfigs::CONFIG[app_id]["key"], FBConfigs::CONFIG[app_id]["secret"], "facebook.friends.getAppUsers", "session_key" => session_key, "call_id" => true )
      self.getUserInfo(app_id, session_key, user_hash)
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end
  end
  
  def self.getUserInfo(app_id, session_key, user_hash)
    begin  
      MiniFB.call(FBConfigs::CONFIG[app_id]["key"], FBConfigs::CONFIG[app_id]["secret"], "facebook.users.getInfo", "session_key" => session_key,
         "uids" => user_hash.join(","), "fields" => FRIEND_FIELDS.join(","))
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end
  end
  
  def self.allUserFriends(app_id, session_key, uid)
    begin 
      user_hash = MiniFB.call(FBConfigs::CONFIG[app_id][:key], FBConfigs::CONFIG[app_id][:secret], "facebook.friends.get", "session_key" => session_key, "call_id" => true )
    rescue IOError => exception
      { :error => 1, :msg => "Error connecting to facebook" }  
    rescue Exception => exception
      { :error => 2, :msg => "Session may have expired. Please try refreshing page" }  
    end
  end

end  
