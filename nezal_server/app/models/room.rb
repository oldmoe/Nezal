class Room 
  
  def self.create(user)
    id = (Time.now.to_f * 10000).to_i.to_s(36)
    room =  { :id => id,  :events => LinkedHash.new , :users => { user[:id] => nil } }
  end

end
