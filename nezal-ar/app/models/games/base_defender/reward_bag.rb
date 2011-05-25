class BD::RewardBag
  def initialize(options)
    metadata = options[:metadata]
    metadata['reward_bags'] ||= {'id_generator' => 0, 'queue' => []}
    metadata['reward_bags']['id_generator'] += 1
    reward = {}    
    reward['id'] = metadata['reward_bags']['id_generator']
    reward['reward_data'] = options[:reward_data]
    reward['time'] = Time.now.utc.to_i
    metadata['reward_bags']['queue'].push reward
  end
  
  def self.use(options)
    profile = options[:profile]
    profile_metadata = profile.metadata
    game_metadata = profile.game.metadata
    reward_id = options[:id]
    profile_metadata['reward_bags']['queue'].each_with_index do |reward, index|
      if reward['id'] == reward_id.to_i
        total_storage = BD::ResourceBuilding.calculate_total_storage(profile_metadata,game_metadata)
        reward_data = reward['reward_data']
        reward_data['rock'] ||= 0
        reward_data['lumber'] ||= 0
        reward_data['gold'] ||= 0
        if(profile_metadata['rock']+reward_data['rock']<=total_storage && 
          profile_metadata['lumber']+reward_data['lumber'] <= total_storage)
            profile_metadata['rock'] = profile_metadata['rock']+reward_data['rock']
            profile_metadata['lumber'] = profile_metadata['lumber']+reward_data['lumber']
            profile.user.coins = profile.user.coins + reward_data['gold']
            profile_metadata['reward_bags']['queue'].delete_at index
        else 
          return {'valid' => false, 'error' => 'Not Enough Storage' }
        end
      end
    end
    profile.save
    return {'valid' => true, 'error' => '' }
  end
end
