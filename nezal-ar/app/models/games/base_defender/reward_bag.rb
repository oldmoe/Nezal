class BD::RewardBag
  def initialize(options)
    profile = options[:profile]
    profile.reward_bags ||= {'id_generator' => 0, 'queue' => []}
    profile.reward_bags['id_generator'] += 1
    reward = {}    
    reward['id'] = profile.reward_bags['id_generator']
    reward['reward_data'] = options[:reward_data]
    reward['time'] = Time.now.utc.to_i
    profile.reward_bags['queue'].push reward
  end
  
  def self.use(options)
    game_data = Game::current.data
    profile = options[:profile]
    reward_id = options[:id]
    profile.reward_bags['queue'].each_with_index do |reward, index|
      if reward['id'] == reward_id.to_i
        total_storage = BD::ResourceBuilding.calculate_total_storage(profile)
        reward_data = reward['reward_data']
        reward_data['rock'] ||= 0
        reward_data['lumber'] ||= 0
        reward_data['gold'] ||= 0
        puts total_storage, profile.rock, profile.lumber
        if( profile.rock + reward_data['rock'] <= total_storage && 
               profile.lumber + reward_data['lumber'] <= total_storage)
          profile.rock = profile.rock + reward_data['rock']
          profile.lumber = profile.lumber + reward_data['lumber']
          user = profile.user
          user.coins += reward_data['gold']
          user.save
          profile.reward_bags['queue'].delete_at index
        else 
          return {'valid' => false, 'error' => 'Not Enough Storage' }
        end
      end
    end
    return {'valid' => true, 'error' => '' }
  end
end
