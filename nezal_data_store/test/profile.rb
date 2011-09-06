require './test/data_store'

class GameProfile < DataStore::Model
  index :rank, :method => :rank
  def rank
    @data['rank']
  end
end

if __FILE__ == $0
  t = Time.now
  20.times do |i|
    p = GameProfile.create(i, {'name'=>"user_#{i+1}", 'rank'=> (rand * 100).round})
  end
  puts Time.now - t
  t = Time.now
  20.times do |i|
    p = GameProfile.get(i)
    p.rank += 1
    p.save
  end
  puts Time.now - t
  pr = GameProfile.get(1)
  t = Time.now
  puts "----------------------------------"
  p pr
  p pr.next(:rank, 5).collect{|p| [p.key, p.name, p.rank] }
  p pr.previous(:rank, 5).collect{|p| [p.key, p.name, p.rank] }
  puts "----------------------------------"
  p GameProfile.first(:rankkkk, 5)
  puts "----------------------------------"
  p GameProfile.last(:rank, 5)
  puts Time.now - t
end


