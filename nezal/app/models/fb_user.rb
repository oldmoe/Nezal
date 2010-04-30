class FBUser
  include DataStore::Storable

  # Those attributes should include coins, basic info
  attr_accessor :attributes
  
  many_to_many  :game_ranks, :class_name => :Rank
  many_to_one  :user_campaigns, :class_name => :UserCampaign, :as => :user
  
  def initialize(hash)
    @attributes = hash
  end
  
  def self.load(id, game_id, campaign, user_info)
    user = FBUser.get(id)
    if user
      puts "User Found : #{user}"
    else
      user = FBUser.create({:id => id, :coins => 0})
      puts "User Not Found : Creating one #{user}"
    end    

    game = Game.get(game_id)
 
    game_rank = user.game_ranks.where(){|rank| rank[:id].index(game[:id]) == 0 }.first
        
    if game_rank.nil?
      game_rank = game.ranks.order({:lower_ep => :ascending}).first
      user.game_ranks << game_rank
      user.save
    end

    user_campaign = user.user_campaigns.where{ |camp| camp[:id].index(game_id + campaign[:id]) == 0 }.first
    if user_campaign.nil?
      camp = UserCampaign.new({:score => 0})
      camp.game= game
      camp.campaign= campaign
      user.user_campaigns << camp
      user.save
    end
   
    user.attributes[:user_info]= user_info
    user
  end
  
  def self.top_scorers(user, game_id, campaign_id)
    users = []
    campaigns = UserCampaign.where{ |camp| camp[:id].index(game_id + campaign_id) == 0 }.order({:score => :descending})
    user_campaign = user.user_campaigns.where{ |camp| camp[:id].index(game_id + campaign_id) == 0 }.first
    user_order = 0
    campaigns.each_with_index do |item, index|
      if item[:id] == user_campaign[:id]
       user_order = index
      end
    end
    users << { :user => user, :order => user_order+1 }
    top_scorers = campaigns.limit(5)
    top_scorers.each_with_index do |rec, index|
      users << { :user => rec.user, :order => index+1 }
    end
    users
  end
  
end
