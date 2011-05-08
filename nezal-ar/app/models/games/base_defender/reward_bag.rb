class RewardBag
  def initialize(options)
    metadata = options[:metadata]
    metadata['reward_bags']['id_generator'] += 1
    reward = {}    
    reward['id'] = metadata['notifications']['id_generator']
    reward['data'] = options[:reward_data]
    reward['time'] = Time.now.utc.to_i
    metadata['reward_bags']['queue'].push reward
  end
  
  def self.use(options)
    profile = options[:profile]
    reward_id = options[:id]
    profile.metadata['reward_bags']['queue'].each_with_index do |reward, index|
      profile.metadata['reward_bags']['queue'].delete_at index if reward['id'] == reward_id.to_i
    end
    profile.save
    return {'valid' => true, 'error' => '' }
  end
end
