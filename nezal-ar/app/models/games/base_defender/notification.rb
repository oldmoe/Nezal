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
end