class Notification
  def initialize(options)
    metadata = options[:metadata]
    metadata['notifications']['id_generator'] += 1
    notification = {}
    notification['text'] = options[:notification_text]
    notification['id'] = metadata['notifications']['id_generator']
    notification['time'] = Time.now.utc.to_i
    metadata['notifications']['queue'].push notification
  end
  
  def self.delete(options)
    profile = options[:profile]
    metadata = BaseDefender.decode(profile.metadata)
    ack_id = options[:id]
    metadata['notifications']['queue'].each_with_index do |notification, index|
      metadata['notifications']['queue'].delete_at index if notification['id'] == ack_id.to_i
    end
    profile.metadata = BaseDefender.encode(metadata)
    profile.save
    return {'valid' => true, 'error' => '' }
  end
end
