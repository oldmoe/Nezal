module BD

  class GlobalMap

    MAP_LIMIT = 100
    BATTLE_WEIGHT = 1
    RANK_WEIGHT = 1

    def initialize(ugp, data)
      @ugp = ugp
      data['friend_ids'].delete(@ugp.service_id.to_i)
      @friend_ids = data['friend_ids'] 
      if !ugp.battle_history
        ugp.battle_history= {}
      end
      @battle_history = ugp.battle_history.clone
      @ranks = Game::current.ranks
      @rank = @ranks[@ugp.rank]
      @friends = get_users_with_ranks(@friend_ids)
      add_battles(@friends, true)
      add_ranks(@friends)
    end
    
    def generate
      if @friend_ids.length >= MAP_LIMIT
        result = @friends.sort{|a,b| weight(a) <=> weight(b)} 
      else
        @users = get_nearby_users
        add_battles(@users)
        index = 0
        result =  merge(@friends, @users, add_ranks_to_battles).sort{|a,b| weight(a) <=> weight(b)}.select do |u|
          index += 1
          index <= MAP_LIMIT || u['friend']
        end
      end
      result = result.collect{|r| {'id'=>r.key,'rank_id'=> r.rank, 'battles'=>r['battles'], 'friend'=>r['friend']}}
      users_profiles = {}
      result.each_with_index do |record, i|
        profile = UserGameProfile.get(record['id'])
        users_profiles[i] = profile unless profile.nil?
      end
      result.each_with_index do |r,i|
        if(users_profiles[i])
          r['service_id'] = users_profiles[i].service_id
          r['user_id'] = users_profiles[i].key
          if(r['protection'] = users_profiles[i].data['protection'].nil?)
            r['protection']  =false
          else 
            r['protection'] = users_profiles[i].data['protection']['working']
          end
        end        
      end
      return result
    end

    def weight(user)
      user['battles'] * BATTLE_WEIGHT - user['rank_diff'].abs * RANK_WEIGHT
    end

    def add_battles(users, friends = false)
      users.each do |u|
        u['friend'] = friends
        u['battles'] = 0
        if bh = @battle_history[u.key]
          u['battles'] = bh['attacked'] + bh['defended']
          @battle_history.delete(u.key)
        end        
      end
    end
    
    def add_ranks_to_battles
      users = []
      @battle_history.keys.each do |key|
        users << UserGameProfile.get(key)
      end
      add_battles(users)
      add_ranks(users)
      users
    end
    
    def merge(list1, list2, list3)
      hash = {}
      list2.each{|el| hash[el.id] = el }
      list1.each { |el| hash.delete(el.id) }
      list1 = list1 + hash.values + list3
    end
    
    def get_nearby_users
      rank = @ranks[@ugp.rank_id]
      before_users = @ugp.previous(:rank, MAP_LIMIT)
      after_users = @ugp.next(:rank, MAP_LIMIT)
      users = add_ranks(before_users + after_users)
      add_battles(users)
      add_ranks(users)
    end
        
    def get_users_with_ranks(service_ids)
      users = []
      service_ids.each do |service_id|
        key = UserGameProfile.generate_key(@ugp.service_type, Game::current.key, service_id)
        user = UserGameProfile.get(key)
        users << user if user
      end
      users = add_ranks(users)
    end
    
    def add_ranks list
      list.each do |u| 
        u['rank_diff'] = u.rank.to_i - @ugp.rank.to_i
      end
    end

  end

end
