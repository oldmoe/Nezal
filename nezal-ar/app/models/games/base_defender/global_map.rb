module BD
  class GlobalMap
    MAP_LIMIT = 100
    BATTLE_WEIGHT = 1
    RANK_WEIGHT = 1

    def initialize(ugp, data)
      @ugp = ugp
      @friend_ids = data['friend_ids']
      if !ugp.metadata['battle_history']
        ugp.metadata['battle_history'] = {}
        ugp.needs_saving
      end
      @battle_history = ugp.metadata['battle_history'].clone
      @ranks = get_ranks(@ugp['game_id'])
      @rank = @ranks[@ugp.rank_id]
      @friends = get_users_with_ranks(@friend_ids)
      add_battles(@friends, true)
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
      result = result.collect{|r| {'id'=>r.id,'rank_id'=> r.rank_id, 'battles'=>r['battles'], 'friend'=>r['friend']}}
      profile_ids = result.collect{|r|r['id']}
      users_profiles =  UserGameProfile.select('user_id, metadata').where(['id in (?)', profile_ids])
      result.each_with_index do |r,i|
        r['service_id'] = users_profiles[i].user.service_id
        r['user_id'] = users_profiles[i].user.id
        if(r['protection'] = users_profiles[i].metadata['protection'].nil?)
          r['protection']  =false
        else 
          r['protection'] = users_profiles[i].metadata['protection']['working']
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
        if bh = @battle_history[u.id]
          u['battles'] = bh['attacked'] + bh['defended']
          @battle_history.delete(u.id)
        end        
      end
    end
    
    def add_ranks_to_battles
      users = UserGameProfile.select('id, rank_id').where(['id in (?)', @battle_history.keys])
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
            
    def get_ranks(game_id)
      ranks = {}
      Rank.where({:game_id => game_id}).order('lower_exp asc').each{|r| ranks[r.id] = r.name.to_i}
      ranks
    end
    
    def get_nearby_users
      rank = @ranks[@ugp.rank_id]
      before_users = UserGameProfile.select('id, rank_id').where(['game_id =  ? AND rank_id > ?', @ugp.game_id, @ugp.rank_id]).order('rank_id').limit(MAP_LIMIT)
      after_users = UserGameProfile.select('id, rank_id').where(['game_id =  ? AND rank_id <= ?', @ugp.game_id, @ugp.rank_id]).order('rank_id').limit(MAP_LIMIT)
      users = add_ranks(before_users + after_users)
    end
        
    def get_users_with_ranks(service_ids)
      user_ids = User.select('id').where(['service_type = ? AND service_id in (?)', @ugp.user.service_type, service_ids])
      users = UserGameProfile.select('id, rank_id').where(['user_id in (?)', user_ids])
      users = add_ranks(users)
    end
    
    def add_ranks list
      list.each do |u| 
        u['user_rank'] = @ranks[u['rank_id']]
        u['rank_diff'] = u['user_rank'] - @rank
      end
    end
  end
end