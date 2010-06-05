# Database schema:
#  users

require 'mini_fb'

class User < Sequel::Model

  unrestrict_primary_key
  set_primary_key [:app_id, :user_id]
  one_to_many :predictions, :key=>[:app_id, :user_id]

  USER_FIELDS = [ "uid", "name", "first_name", "last_name", "pic_big", "profile_url" ]
  
  attr_accessor :session
    
  def global_top_scorers(round = :global_score, limit = 3)
    result = self.class.filter(:app_id => self[:app_id]).order(round.desc).limit(limit).all || []
    self.class.load_users_info(self[:app_id], result, session() ) unless result.empty?
    result
  end
    
  def friends_top_scorers(round = :global_score, limit = 3)
    result = self.class.filter([{:app_id => self[:app_id]}, {:user_id => friends() + [ self[:user_id]] }]).order(round.desc).limit(limit).all
    self.class.load_users_info(self[:app_id], result, session() ) unless result.empty?
    result
  end
  
  def global_ranking( round = :global_score, limit = 5 )
    result = {}
    result[:rank] = self.class.filter( [ {:app_id => self[:app_id]}, "#{round} >  #{self[round]}" ] ).count + 1
    result[:previous] = self.class.filter( [ {:app_id => self[:app_id]}, "#{round} >  #{self[round]}" ] ).order(round).limit(limit).all
    result[:next] = self.class.filter( [{:app_id => self[:app_id]}, "user_id != #{self[:user_id]}", "#{round} <=  #{self[round]}" ] ).order(round.desc).limit(limit).all
    self.class.load_users_info(self[:app_id], result[:previous] + result[:next], session() )
    result[:previous] = result[:previous].reverse
    result[:next] = result[:next].reverse
    result
  end
  
  def among_friends_ranking(round = :global_score , limit = 5)
    result = {}
    selection = self.class.filter([ {:app_id => self[:app_id]}, {:user_id => friends()}, "#{round} >  #{self[round]}" ] )
    result[:rank] = self.class.filter([ {:app_id => self[:app_id]}, {:user_id => friends()}, "#{round} >  #{self[round]}" ] ).count + 1
    result[:previous] = self.class.filter([ {:app_id => self[:app_id]}, {:user_id => friends()}, "#{round} >  #{self[round]}" ] ).order(round).limit(limit).all
    result[:next] = self.class.filter( [{:app_id => self[:app_id]}, {:user_id => friends()}, "#{round} <=  #{self[round]}"] ).order(round.desc).limit(limit).all
    self.class.load_users_info(self[:app_id], result[:previous] + result[:next], session() )
    result[:previous] = result[:previous].reverse
    result[:next] = result[:next].reverse
    result
  end
  
  def test(session)
    p self.user_info(session)
    p self.friends()
    p self.friends_top_scorers()
    p self.among_friends_ranking()
    p self.global_top_scorers()
    p self.global_ranking()
  end
  
  def user_info(session)
    @user_info  ||=  if session
              puts "Inside get user_info"
              result = MiniFB.call( FB_CONFIGS[self[:app_id]]["key"], FB_CONFIGS[self[:app_id]]["secret"], "facebook.users.getInfo", "session_key" => session,
                        "uids" => self[:user_id], "fields" => USER_FIELDS.join(","))
              result.first
            else
              {}
            end
  end 
  
  def user_info= (user_info)
    @user_info = user_info
  end

  def self.load_users_info(app_id, users, session)
    ids = []
    users.each { |user| ids << user[:user_id] }
    users_info  =  if session
              MiniFB.call( FB_CONFIGS[app_id]["key"], FB_CONFIGS[app_id]["secret"], "facebook.users.getInfo", "session_key" => session,
                        "uids" => ids.join(","), "fields" => USER_FIELDS.join(","))
            else
              {}
            end
    users_hash = {}
    users_info.each { |user| users_hash[user["uid"].to_s] = user }
    users.each { |user| user.user_info= users_hash[user[:user_id]]}
  end  


  def friends()
    @user_hash ||= if session()
                    puts "Inside Friend get"
                    MiniFB.call( FB_CONFIGS[self[:app_id]]["key"],
                             FB_CONFIGS[self[:app_id]]["secret"],
                             "facebook.friends.getAppUsers",
                             "session_key" => session(),
                             "call_id" => true ) 
                end
    @user_hash = [] if (!@user_hash || @user_hash.empty?)
    @user_hash
  end
  
end
