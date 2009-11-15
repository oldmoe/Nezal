class Event

  def self.create(data, user)
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    event =  { :id => id, :data => data, :user => user }
  end
  
end
