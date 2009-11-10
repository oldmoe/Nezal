class User
  
  @@users = $data[:users]
  
  def self.users
    @@users
  end
  
  def self.create
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    user =  { :id => id }
    @@users[id] = user
    user
  end
  
end
