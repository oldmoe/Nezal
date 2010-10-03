require 'json'

class CityDefender < Metadata
  
  WIN_EXP_FACTOR = (1.5/50)
  LOSE_EXP_FACTOR = (1.0/50)
  WIN_COIN_FACTOR = (1.0/300)
  
  def self.init_game_profile(game_profile)
    game_data = self.decode(game_profile.game.metadata)
    towers = {}
    weapons = {}
    game_data['towers'].each_pair do |key, val|
      if val['unlocked'] == true
        towers[key] = {'upgrades' =>  val['upgradeLevel']}
      end
    end
    game_data['weapons'].each_pair do |key, val|
      if val['unlocked'] == true
        weapons[key] = {'upgrades' => val['upgradeLevel']}
      end
    end
    game_profile.metadata= self.encode({'towers'=>towers,'weapons'=>weapons})
    game_profile.save
  end
  
  def self.load_game_profile(game_profile)
    game_profile.metadata || "{}"
  end
  
  def self.edit_game_profile(game_profile, data)
    data = self.decode(data)
    if data['event'] == 'unlock'
      self.unlock(game_profile, data)
    elsif data['event'] == 'upgrade'
      self.upgrade(game_profile, data)
    end
    game_profile.metadata || "{}"
  end
  
  def self.load_campaign(camp)
    metadata = []
    camp_data = self.decode(camp.metadata)
    camp_data.each  do | mission|
        metadata[mission['order'] -1 ] = {}
        mission.each_pair { |key, val| metadata[mission['order'] -1 ][key] = val }
        metadata[mission['order'] -1 ]['waves'] = []
        metadata[mission['order'] -1]['map'] = []
        metadata[mission['order'] -1]['mapEntry'] = [['',''],['','']]
    end
    metadata    
  end
  
  def self.init_user_campaign(user_campaign)
    user_campaign.metadata= self.encode({'missions'=> [ { 'order' => 1, 'score' => 0 } ] })
    user_campaign.save
  end
  
  def self.load_user_campaign(user_campaign)
    camp_data = self.decode(user_campaign.campaign.metadata)
    user_camp_data = self.decode(user_campaign.metadata)
    camp_data.each  do | mission|
      if user_camp_data['missions'][mission['order'] - 1]
        user_camp_data['missions'][mission['order'] - 1]['waves'] = mission['waves']
        user_camp_data['missions'][mission['order'] - 1]['map'] = mission['map']
        user_camp_data['missions'][mission['order'] - 1]['mapEntry'] = mission['mapEntry']
      end
    end
    user_camp_data
  end
  
  def self.edit_user_campaign(user_campaign, data_encoded)
    data = self.decode(data_encoded)
    metadata = self.decode(user_campaign.metadata)
    if metadata['missions'][data['mission'] -1]
      old_score = metadata['missions'][data['mission'] -1]['score']
      metadata['missions'][data['mission'] -1]['score'] = 
                                                  if metadata['missions'][data['mission'] -1]['score'] > data['score']
                                                    metadata['missions'][data['mission'] -1]['score']
                                                  else
                                                    old_score = metadata['missions'][data['mission'] -1]['score']
                                                    data['score']
                                                  end
      user_campaign.score -= old_score 
      user_campaign.score += metadata['missions'][data['mission'] -1]['score']
      if (data['win'])
        metadata['missions'][data['mission']] = { 'order' => data['mission'] + 1, 'score' => 0 }
        user_campaign.profile.exp += ( data['score'] * WIN_EXP_FACTOR).round
        user_campaign.profile.user.coins += (data['score']*WIN_COIN_FACTOR).round
      else
        user_campaign.profile.exp += ( data['score'] * LOSE_EXP_FACTOR).round
      end
      ranks = user_campaign.profile.game.ranks.where( " lower_exp <= #{user_campaign.profile.exp} AND " + 
                                              " ( upper_exp > #{user_campaign.profile.exp} OR upper_exp == -1 ) "  )
      user_campaign.profile.rank = ranks.first
      user_campaign.metadata = self.encode(metadata)
      user_campaign.profile.user.save
      user_campaign.profile.save
      user_campaign.save
    end
  end
  
  def self.unlock(game_profile, data)
    game_data = self.decode(game_profile.game.metadata)
    profile_data = self.decode(game_profile.metadata)
    if (game_data[data['type']][data['item_id']]['cost'].to_i <= game_profile.user.coins &&
          game_data[data['type']][data['item_id']]['exp'].to_i <= game_profile.exp )
      game_profile.user.coins -= game_data[data['type']][data['item_id']]['cost'].to_i
      if !(profile_data[data['type']][data['item_id']])
        profile_data[data['type']][data['item_id']] = {'upgrades' => game_data[data['type']][data['item_id']]['upgradeLevel']}
      end
      game_profile.user.save
      game_profile.metadata = self.encode(profile_data)
      game_profile.save
    end
  end
  
  def self.upgrade(game_profile, data)
    game_data = self.decode(game_profile.game.metadata)
    profile_data = self.decode(game_profile.metadata)
    upgrade = profile_data[data['type']][data['item_id']]['upgrades']
    upgrades = self.decode(game_data[data['type']][data['item_id']]['upgrades'])
    if(upgrades[upgrade])
      if (upgrades[upgrade]['cost'].to_i <= game_profile.user.coins &&
            upgrades[upgrade]['exp'].to_i <= game_profile.exp )
        game_profile.user.coins -= upgrades[upgrade]['cost'].to_i
        profile_data[data['type']][data['item_id']]['upgrades'] += 1
        game_profile.user.save
        game_profile.metadata = self.encode(profile_data)
        game_profile.save
      end
    end
  end
  
  def self.newbie_no_more(game_profile)
    game_profile.exp = 500
    ranks = game_profile.game.ranks.where( " lower_exp <= #{game_profile.exp} AND " + 
                                                " ( upper_exp > #{game_profile.exp} OR upper_exp == -1 ) "  )
    game_profile.rank = ranks.first
    game_profile.save
  end
  
end
