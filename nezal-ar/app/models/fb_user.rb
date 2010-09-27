require 'mini_fb'

class FbUser < ActiveRecord::Base
  
  has_many  :game_profiles, :class_name => "UserGameProfile", :dependent => :destroy, :foreign_key => 'user_id'
  
  attr_accessor :session

  # Get Global Top Scorers 
  def self.top_scorers(camp_id, user_ids = [], limit = 3)
    conditions =  " campaign_id = #{camp_id} "
    if user_ids && !(user_ids.empty?)
     conditions+= " AND fb_user IN (#{user_ids})"
    end
    UserCampaign.all( :conditions => conditions, :limit => limit, :order=> 'user_campaigns.score DESC, fb_user')
  end
  
  def friends_top_scorers(camp_id,friends, limit = 3)
    self.class.top_scorers(camp_id, friends, limit)
  end
  
  # Get User Ranking
  # Call it with empty list to get user global ranking 
  # Call it with friends fb_ids to get user among friends ranking
  def ranking(camp_id, user_ids = [], list_size = 10, top_score_size = 3 )
    result = {}   
    before_length = list_size/2 
    after_length = list_size - before_length
    conditions =  " campaign_id = #{camp_id} "
    if user_ids && !(user_ids.empty?)
      conditions += " AND fb_user IN (#{user_ids.gsub!(' ','')})"
    end
    user_campaign = UserCampaign.find_by_campaign_id_and_fb_user(camp_id, self.fb_id) || UserCampaign.new({'score' => 0, 'fb_user' => self.fb_id})
    result[:rank] =  UserCampaign.count( :conditions => conditions + " AND ( score > #{user_campaign.score} " + 
                                                                             " OR ( score == #{user_campaign.score}" + 
                                                                                   " AND fb_user < #{user_campaign.fb_user} ) )" ) + 1
    result[:user_camp] = user_campaign
    if result[:rank] < top_score_size
      before_length = 0
      after_length = ( top_score_size - result[:rank] ) + list_size      
    end
    if (before_length)
      result[:previous] = UserCampaign.order('score, fb_user DESC').limit(before_length).all( :conditions => conditions + 
                                                                              " AND (score > #{user_campaign.score}" +
                                                                              " OR (score == #{user_campaign.score}" + 
                                                                                    " AND fb_user < #{user_campaign.fb_user} ) )")
      result[:previous] = result[:previous].reverse
      after_length = list_size - result[:previous].length
    end
    result[:next] =  UserCampaign.order('score DESC, fb_user').limit(after_length).all( :conditions => conditions + 
                                                                                            " AND ( score < #{user_campaign.score}" +
                                                                                            " OR (score == #{user_campaign.score}" + 
                                                                                                  " AND fb_user > #{user_campaign.fb_user} ) )" ) 
    if result[:rank] < top_score_size
     result[:next] = result[:next][(top_score_size - result[:rank])..(result[:next].length-1)]
    end
    result[:next] = [] if !result[:next]
    result
  end

  # Get User among Friends Ranking
  def among_friends_ranking(camp_id, limit = 5)
    self.ranking(camp_id, friends(), limit)
  end

  # Get list of user friends who use the app
  def friends()
=begin
    @user_hash ||= if session()
                    MiniFB.call( FB_CONFIGS[self[:app_id]]["key"],
                             FB_CONFIGS[self[:app_id]]["secret"],
                             "facebook.friends.getAppUsers",
                             "session_key" => session(),
                             "call_id" => true ) 
                end
    @user_hash = [] if (!@user_hash || @user_hash.empty?)
    @user_hash
=end
  end    
  
end
