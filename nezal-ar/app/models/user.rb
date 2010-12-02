class User < ActiveRecord::Base
  
  attr_accessible :service_id
  attr_accessible :service_type
  has_many  :game_profiles, :class_name => "UserGameProfile", :dependent => :destroy, :foreign_key => 'user_id'

  # Get Global Top Scorers 
  def top_scorers(camp_id, user_service_ids = [], limit = 3)
    conditions = " campaign_id = #{camp_id} AND service_type = #{self.service_type} "    
    if user_service_ids && !(user_service_ids.empty?)
      ids = User.all(:conditions => " service_id IN (#{user_service_ids}) ").collect { |user| user.id }.to_s.sub('[', '').sub(']', '')
      conditions += " AND user_id IN (#{ids}) "
    end
    UserCampaign.all( :conditions => conditions, :limit => limit, :order=> 'user_campaigns.score DESC, user_campaigns.user_id' )
  end
  
  def friends_top_scorers(camp_id, friends, limit = 3)
    top_scorers(camp_id, friends, limit)
  end
  
  # Get User Ranking
  # Call it with empty list to get user global ranking 
  # Call it with friends service_ids to get user among friends ranking
  def ranking(camp_id, user_ids = [], list_size = 10, top_score_size = 3 )
    result = {}   
    before_length = list_size/2 
    after_length = list_size - before_length
    conditions =  " campaign_id = #{camp_id} AND service_type = #{self.service_type} "
    if user_ids && !(user_ids.empty?)
      conditions += " AND user_id IN (#{user_ids.gsub!(' ','')})"
    end
    user_campaign = UserCampaign.where( :campaign_id => camp_id, :user_id => self.id).first || 
                                              UserCampaign.new({'score' => 0, 'user_id' => self.id})
    result[:rank] =  UserCampaign.count( :conditions => conditions + 
                                          " AND ( score > #{user_campaign.score} " + 
                                               " OR ( score == #{user_campaign.score}" + 
                                                     " AND user_id < #{user_campaign.user_id} ) )" ) + 1
    result[:user_camp] = user_campaign
    if result[:rank] < top_score_size
      before_length = 0
      after_length = ( top_score_size - result[:rank] ) + list_size      
    end
    if (before_length)
      result[:previous] = UserCampaign.order('score, user_id DESC').limit(before_length).all( :conditions => conditions + 
                                              " AND (score > #{user_campaign.score}" +
                                                  " OR (score == #{user_campaign.score}" + 
                                                      " AND user_id < #{user_campaign.user_id} ) )")
      result[:previous] = result[:previous].reverse
      after_length = list_size - result[:previous].length
    end
    result[:next] =  UserCampaign.order('score DESC, user_id').limit(after_length).all( :conditions => conditions + 
                                               " AND ( score < #{user_campaign.score}" +
                                                      " OR (score == #{user_campaign.score}" + 
                                                            " AND user_id > #{user_campaign.user_id} ) )" ) 
    if result[:rank] < top_score_size
     result[:next] = result[:next][(top_score_size - result[:rank])..(result[:next].length-1)]
    end
    result[:next] = [] if !result[:next]
    result
  end

  # Get User among Friends Ranking
  def among_friends_ranking(camp_id, limit = 5)
    self.ranking(camp_id, friends, limit)
  end
  
end
