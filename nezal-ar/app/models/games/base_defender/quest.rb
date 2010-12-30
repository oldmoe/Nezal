module BD

  class Quest

    CONDITIONS = {
        :buildings => {
                        "townhall" => [:level],
                        "quarry" => [:level],
                        "lumbermill" => [:level]
                    }, # For all the defined buildings, u can make a condition regarding the level of one of the buildings
        :resources => ["lumber", "rock", "workers"] # For all the resources, u can make a condition about the direct value of a certain resource
    }

    # Base Defender Quests : 
    #   metadata construction : Admin Controlling method to update a game quest data
    #     - rewards : hash of items rewarded to the user for passing the quest. can include exp, coins.
    #     - conditions : hash of items defining the quest. If the user profile data qualifies for passing the quest
    #                    Then the user is assigned the next quest and rewarded with the quest rewards as described above.
    def self.edit_quest(quest, data)
      quest_data = Metadata.decode(data)
      quest.metadata ||= { :conditions => {}, :rewards => {} }
      quest_data.each_pair { |key, val| quest.metadata[key] = val }
      quest.save
    end

    # Admin Controlling method to add a new quest
    def self.init_quest(quest)
      quest.metadata = {:conditions => {}, :rewards => {}}
    end

    def self.assess_user_quests(user_game_profile)
      # Decode metadata, initialize the user quest hash if not fount
      user_game_profile.metadata['quests'] ||= {'primal' => [], 'current' => [], 'conquered' => []}
      # Pass by the current quests, check for conquered ones, reward them & move them to conquered ones 
      user_game_profile.metadata['quests']['current'].each do |id|
        quest = ::Quest.where(:id => id).first
        if quest && self.conquered?(user_game_profile.metadata, quest)
          # Reward, move to conquered
          user_game_profile.metadata['quests']['conquered'] << id
          user_game_profile.metadata['quests']['current'].delete(id)
          self.reward(user_game_profile, quest)
        end
      end
      # Get newly added primal quests that the user hasnt yet begun
      # Add the conquered ones to conquered list, others to current
      quests = user_game_profile.game.quests.where(" primal='t' AND id NOT IN ( #{user_game_profile.metadata['quests']['primal'].join(',')} )").all
      quests.each do |quest|
        self.conquered?(user_game_profile.metadata, quest) ? 
                user_game_profile.metadata['quests']['conquered'] << quest.id : user_game_profile.metadata['quests']['current'] << quest.id
      end
      new_quests = quests.collect {|quest| quest.id}
      user_game_profile.metadata['quests']['primal'].concat(new_quests)
      # Pass on all conquered and add the next one to the current list if not conquered to
      user_game_profile.metadata['quests']['conquered'].each do |id|
        quests = ::Quest.where(:parent => id).all
        # If all children are conquered remove their parent from conquered
        remove_parent = true
        quests.each do |id|
          if user_game_profile.metadata['quests']['conquered'].index(id)
            quests.delete(id)
          else
            quest = ::Quest.where(:id => id).first
            if self.conquered?(user_game_profile.metadata, quest)
              user_game_profile.metadata['quests']['conquered'] << quest.id unless user_game_profile.metadata['quests']['conquered'].index(quest.id)
            else
              user_game_profile.metadata['quests']['current'] << quest.id unless user_game_profile.metadata['quests']['current'].index(quest.id)
              remove_parent = false
            end
          end
        end
        if remove_parent
          # If that was not end of chain, remove it .. else keep it for next quests
          quests = ::Quest.where(:parent => id).all
          user_game_profile.metadata['quests']['conquered'].delete(id) if (quests && quests.length > 0)
        end
      end
      ################ This should be removed after we move texts to locales ################
      user_game_profile.metadata['quests']['descriptions'] = {}
      user_game_profile.metadata['quests']['current'].each do | id |
        quest = ::Quest.where(:id=>id).first
        if quest
          user_game_profile.metadata['quests']['descriptions'][id] = {}
          user_game_profile.metadata['quests']['descriptions'][id]['name'] = quest.name
          user_game_profile.metadata['quests']['descriptions'][id]['desc'] = ""
          quest.metadata['conditions'].each_pair do | item, conditions |
            if CONDITIONS[:buildings][item]
              user_game_profile.metadata['quests']['descriptions'][id]['desc'] =  user_game_profile.metadata['quests']['descriptions'][id]['desc'] +
                                                            "Obtain " + item + " with following specifications"
              conditions.each_pair do | cond, cond_val|
                user_game_profile.metadata['quests']['descriptions'][id]['desc'] =  user_game_profile.metadata['quests']['descriptions'][id]['desc'] + ", " +
                                                              cond + " : " + cond_val.to_s
              end
              user_game_profile.metadata['quests']['descriptions'][id]['desc'] =  user_game_profile.metadata['quests']['descriptions'][id]['desc'] + ". "
            elsif CONDITIONS[:resources].index(item)
              user_game_profile.metadata['quests']['descriptions'][id]['desc'] =  user_game_profile.metadata['quests']['descriptions'][id]['desc'] + 
                                                            "Obtain up to " + conditions.to_s + " " +  item + ". "
            end
          end
        end
      end
      #######################################################################################
      user_game_profile.save
    end

    def self.conquered?(metadata, quest)
      conquered = true
      quest.metadata['conditions'].each_pair do | item, conditions |
        if CONDITIONS[:buildings][item]
          if metadata[item]
            metadata[item].each_pair do |key, value|
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
        elsif CONDITIONS[:resources].index(item)
          conquered = false if metadata[item] < conditions 
        end
        break unless conquered
      end 
      conquered
    end

    def self.reward(user_game_profile, quest)
      Notification.new( {:metadata => user_game_profile.metadata,
                         :notification_text => quest.name + " Quest Conquered! You ve earned #{quest.metadata['rewards']['coins']} coins" + 
                                                            " & #{quest.metadata['rewards']['exp']} experience points" } )
      if quest.metadata['rewards']['exp']
        
        puts user_game_profile.exp.class
        puts quest.metadata['rewards']['exp'].class
        
        user_game_profile.exp = user_game_profile.exp.to_i + quest.metadata['rewards']['exp']
      end
      if quest.metadata['rewards']['coins'] 
        user_game_profile.user.coins += quest.metadata['rewards']['coins']
        user_game_profile.user.save
      end
    end

  end

end
