class User
  
  def self.create
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    user =  { :id => id }
  end
  
end
