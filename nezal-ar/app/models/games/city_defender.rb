require 'json'

class CityDefender < Metadata
  
  def self.init_game_profile(game_profile)
    game_profile.metadata= self.encode({'towers'=>[],'weapons'=>[],'upgrades'=>[],
                                        'added'=>{'towers'=>[],'weapons'=>[],'upgrades'=>[]}, 'weapons_package'=>{}})
  end
  
  def self.load_game_profile(game_profile)
    game_profile.metadata || "{}"
  end
  
  def self.edit_game_profile(game_profile, data)
    data = self.decode(data)
    if data['event'] == 'unlock'
      self.unlock(game_profile, data)
    elsif data['event'] == 'market_preferences'
      self.save_market_preferences(game_profile, data)
    elsif data['event'] == 'consumed_weapons'
      self.save_consumed_weapons(game_profile, data)
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
    if (data['win'])
      metadata['missions'][data['mission']] = { 'order' => data['mission'] + 1, 'score' => 0 }
      if metadata['missions'][data['mission'] -1]
        metadata['missions'][data['mission'] -1]['score'] = 
                                                    if metadata['missions'][data['mission'] -1]['score'] > data['score']
                                                      metadata['missions'][data['mission'] -1]['score']
                                                    else
                                                      data['score']
                                                    end
        user_campaign.profile.score += ( data['score'] / 1000)
        ranks = user_campaign.profile.game.ranks.where( " lower_exp <= #{user_campaign.profile.score} AND " + 
                                                " ( upper_exp > #{user_campaign.profile.score} OR upper_exp == -1 ) "  )
        user_campaign.profile.rank = ranks.first
        user_campaign.metadata = self.encode(metadata)
        user_campaign.profile.save
        user_campaign.save
      end
    end
    self.save_consumed_weapons(user_campaign.profile, data)
  end
  
  def self.unlock(game_profile, data)
    profile_data = self.decode(game_profile.metadata)
    if (game_data[data['type']][data['item_id']]['cost'].to_i <= game_profile.user.coins &&
          game_data[data['type']][data['item_id']]['exp'].to_i <= game_profile.score )
      game_profile.user.coins -= game_data[data['type']][data['item_id']]['cost'].to_i
      if !(profile_data[data['type']].include?data['item_id'])
        profile_data[data['type']].push(data['item_id'])
      end
      if(data['type']=='weapons')
          profile_data['weapons_package'][data['item_id']] ||= 0
          profile_data['weapons_package'][data['item_id']] += 
                               game_data[data['type']][data['item_id']]['package']
      end
      game_profile.user.save
      game_profile.metadata = self.encode(profile_data)
      game_profile.save
    end
  end
  
  def self.save_market_preferences(game_profile, data)
      profile_data = self.decode(game_profile.metadata)
      profile_data['added'] = data['preferences']
      game_profile.metadata = self.encode(profile_data)
      game_profile.save
  end
  
  def self.save_consumed_weapons(game_profile, data)
    profile_data = self.decode(game_profile.metadata)
    profile_data['weapons_package'] ||= {}
    items = data['items']
    changed = false
    items.each_pair do |key, value|
       if value > 0 && profile_data['weapons_package'][key]
            changed = true
            profile_data['weapons_package'][key] -= value
            if profile_data['weapons_package'][key] == 0 
                profile_data['weapons_package'].delete(key)
                profile_data['weapons'].delete(key)
                profile_data['added']['weapons'].delete(key)
            end
        end
    end
    if changed
        game_profile.metadata = self.encode(profile_data)
        game_profile.save
    end
  end
  
end
