module BD

  class Quest

    CONDITIONS = {
        :buildings => {
                        "townhall" => [:level],
                        "quarry" => [:level, :assigned_workers],
                        "lumbermill" => [:level, :assigned_workers]
                    }, # For all the defined buildings, u can make a condition regarding the level of one of the buildings
        :resources => ["lumber", "rock", "workers"] # For all the resources, u can make a condition about the direct value of a certain resource
    }

    REWARDS = { 
        :profile => ["coins", "exp"],
        :resources => ["lumber", "rock"]
    }

    STATUS = { 
      :not_started => -1,
      :in_progress => 0,
      :done => 1      
    }

    CATEGORIES = {
      :civil => 1,
      :military => 2,
      :social => 3
    }

    def initialize(quest_data)
      game = Game::current
      game.data['quests'] ||= {'id_generator' => 0, 'list' => {}}
      parent = if quest_data["parent"] && !(quest_data["parent"].empty?)
                quest_data["parent"]
              else
                nil
              end
      quest = {:name => quest_data["name"], :parent => parent, :conditions => {}, :rewards => {}}
      quest[:primal] = (quest_data["primal"]) ? true : false
      quest['id'] = (game.data['quests']['id_generator']).to_s
      game.quests['id_generator'] += 1
      game.quests['list'][quest['id']] = quest
      game.save
    end

    class << self

      def init()
        game = Game::current
        game.data['quests'] ||= {'id_generator' => 0, 'list' => {}}
        game.save
      end

      # Base Defender Quests : 
      #   metadata construction : update a game quest data
      #     - rewards : hash of items rewarded to the user for passing the quest. can include exp, coins.
      #     - conditions : hash of items defining the quest. If the user profile data qualifies for passing the quest
      #                    Then the user is assigned the next quest and rewarded with the quest rewards as described above.
      def edit(quest_id, data)
        init()
        game = Game::current
        quest_data = Metadata.decode(data)
        if !quest_data['parent'] || !(game.quests['list'][quest_data['parent']])
          quest_data['parent'] = nil
        end
        game.quests['list'][quest_id] = quest_data
        game.save
      end
    
  
      def delete(quest_id)
        init()
        game = Game::current
        puts game.quests['list'].delete(quest_id)
        game.save
      end

      def find(quest_id)
        init()
        game = Game::current
        game.data['quests']['list'][quest_id]
      end

      def all()
        init()
        game = Game::current
        p game.quests['list']
        game.quests['list']
      end

      def assess_user_quests(user_game_profile)
        # Decode metadata, initialize the user quest hash if not found
        user_game_profile.quests ||= {'primal' => [], 'current' => [], 'conquered' => []}
        # Pass by the current quests, check for conquered ones, reward them & move them to conquered ones 
        user_game_profile.quests['current'].each do |id|
          quest = Game::current.quests['list'][id]
          if quest && self.conquered?(user_game_profile, quest)
            # Reward, move to conquered
            user_game_profile.quests['conquered'] << id
            user_game_profile.quests['current'].delete(id)
            self.reward(user_game_profile, quest)
          end
        end
        # Get newly added primal quests that the user hasnt yet begun
        # Add the conquered ones to conquered list, others to current
        quests = Game::current.quests['list'].select do | key, val |
                                                              val['primal'] && ! user_game_profile.quests['primal'].index(key)
                                                          end

        quests.each_pair do |key, quest|
          self.conquered?(user_game_profile, quest) ? 
                      user_game_profile.quests['conquered'] << quest['id'] : user_game_profile.quests['current'] << quest['id']
        end
        new_quests = quests.values.collect {|quest| quest['id']}
        user_game_profile.quests['primal'].concat(new_quests)
        # Pass on all conquered and add the next one to the current list if not conquered to
        user_game_profile.quests['conquered'].each do |id|
          quests = Game::current.quests['list'].select do | key, val |
                                                              val['parent']==id
                                                          end
          # If all children are conquered remove their parent from conquered
          remove_parent = quests.keys.length > 0 ? true : false
          quests.each_pair do |id, value|
          if user_game_profile.quests['conquered'].index(id)
              quests.delete(id)
            else
              if self.conquered?(user_game_profile, value)
                user_game_profile.quests['conquered'] << id unless user_game_profile.quests['conquered'].index(id)
              else
                user_game_profile.quests['current'] << id unless user_game_profile.quests['current'].index(id)
                remove_parent = false
              end
            end
          end
          if remove_parent
            user_game_profile.quests['conquered'].delete(id)
          end
        end
      end

      def conquered?(profile, quest)
        conquered = true
        quest['conditions']['buildings'].each_pair do | item, conditions |
          if profile.data[item]
            profile.data[item].each_pair do |key, value|
              condition_met = true
              conditions.each_pair do |cond, cond_val|
                if value[cond].nil? || (value[cond] && value[cond] < cond_val)
                  condition_met = false 
                  break
                end
              end
              conquered = condition_met
              break if conquered
            end
          else
            conquered = false 
          end
          break unless conquered
        end
        quest['conditions']['resources'].each_pair do | item, conditions |
          condition_met = true
          condition_met = false if profile.data[item] < conditions 
          conquered &= condition_met
          break unless conquered
        end
        conquered
      end

      # Status each condition in the quest
      def status(profile, quest)
        status = { :buildings => {}, :resources => {} }
        quest['conditions']['buildings'].each_pair do | item, conditions |
          status[:buildings][item] = {}
          if profile.data[item]
            profile.data[item].each_pair do |key, value|
              condition_met = true
              conditions.each_pair do |cond, cond_val|
                condition = false
                condition_status = { :id => key, :status => self::STATUS[:not_started], :value => value[cond] || 0, :target => cond_val }
                if value[cond] && value[cond] >= cond_val
                  condition_status[:status] = self::STATUS[:done]
                  condition = true
                elsif value[cond]
                  condition_status[:status] = self::STATUS[:in_progress]
                  condition = false
                else
                  condition_status[:status] = self::STATUS[:not_started]
                  condition = false
                end
                status[:buildings][item][cond] = condition_status
                condition_met &&= condition
              end
              break if condition_met
            end
          else
            conditions.each_pair do |cond, cond_val|
              status[:buildings][item][cond] =  { :status => self::STATUS[:not_started], :value => 0, :target => cond_val }
            end
          end
        end
        quest['conditions']['resources'].each_pair do | item, conditions |
          condition_status = { :status => self::STATUS[:done], :value => profile.item || 0, :target => conditions}
          if profile.data[item] && (profile.data[item] < conditions)
            condition_status[:status] = self::STATUS[:not_started]
          end
          status[:resources][item] = condition_status
        end 
        status
      end

      def reward(user_game_profile, quest)
        Notification.new( {:metadata => user_game_profile.data, :notification_type => "quest",
                            :notification_data => {:rewards => quest['rewards'], :id => quest['id']} })
        if quest['rewards']['exp']
          user_game_profile.exp= user_game_profile.exp.to_i + quest['rewards']['exp']
        end
        reward_data = {}
        if quest['rewards']['coins']
          reward_data['gold'] = quest['rewards']['coins']
        end
        self::REWARDS[:resources].each do | reward |
          if quest['rewards'][reward]  
            reward_data[reward] = quest['rewards'][reward].to_i
          end
        end
        BD::RewardBag.new({ :profile => user_game_profile, :reward_data => reward_data })
      end

      def load_quests user_game_profile
        descriptions = {}
        user_game_profile.quests['current'].each do | id |
          quest = Game::current.quests['list'][id]
          if quest
            descriptions[id] = quest
            descriptions[id]['status'] = self.status(user_game_profile, quest)
          end
        end
        descriptions
      end
      
    end

  end

end
