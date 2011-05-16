class Notification
  def initialize(options)
    metadata = options[:metadata]
    metadata['notifications']['id_generator'] += 1
    notification = {}
    notification['type'] = options[:notification_type]
    notification['text'] = options[:notification_text]
    notification['id'] = metadata['notifications']['id_generator']
    notification['data'] = options[:notification_data]
    notification['time'] = Time.now.utc.to_i
    metadata['notifications']['queue'].push notification
  end
  
  # Takes an array of ids or single id in the options
  def self.delete(options)
    profile = options[:profile]
    ack_ids = options[:ids] || [options[:id]] || []
    profile.metadata['notifications']['queue'].each_with_index do |notification, index|
      if (ack_ids.include? (notification['id']).to_s) || (ack_ids.include? notification['id'])
        profile.metadata['notifications']['queue'].delete_at index 
      end
    end
    profile.save
    return {'valid' => true, 'error' => '' }
  end
end
