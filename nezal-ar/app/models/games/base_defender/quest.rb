module BD

  class Quest

    CONDITIONS = {
        :buildings => {
                        "townhall" => [:level],
                        "quarry" => [:level],
                        "mine" => [:level]
                    }, # For all the defined buildings, u can make a condition regarding the level of one of the buildings
        :resources => ["iron", "rock", "workers"] # For all the resources, u can make a condition about the direct value of a certain resource
    }

    # Base Defender Quests : 
    #   metadata construction : Admin Controlling method to update a game quest data
    #     - rewards : hash of items rewarded to the user for passing the quest. can include exp, coins.
    #     - conditions : hash of items defining the quest. If the user profile data qualifies for passing the quest
    #                    Then the user is assigned the next quest and rewarded with the quest rewards as described above.
    def self.edit_quest(quest, data)
      quest_data = Metadata.decode(data)
      quest.decoded_metadata ||= { :conditions => {}, :rewards => {} }
      quest_data.each_pair { |key, val| quest.decoded_metadata[key] = val }
      quest.metadata = Metadata.encode(quest.decoded_metadata)
      quest.save
    end

    # Admin Controlling method to add a new quest
    def self.init_quest(quest)
      quest.metadata = Metadata.encode({:conditions => {}, :rewards => {}})
    end

    def self.assess_user_quests(user_game_profile)
      # Decode metadata, initialize the user quest hash if not fount
      metadata = user_game_profile.decoded_metadata
      metadata['quests'] ||= {'primal' => [], 'current' => [], 'conquered' => []}
      # Pass by the current quests, check for conquered ones, reward them & move them to conquered ones 
      metadata['quests']['current'].each do |id|
        quest = ::Quest.where(:id => id).first
        if quest && self.conquered?(metadata, quest)
          # Reward, move to conquered
          metadata['quests']['conquered'] << id
          metadata['quests']['current'].delete(id)
          self.reward(user_game_profile, quest)
        end
      end
      # Get newly added primal quests that the user hasnt yet begun
      # Add the conquered ones to conquered list, others to current
      quests = user_game_profile.game.quests.where(" primal='t' AND id NOT IN ( #{metadata['quests']['primal'].join(',')} )").all
      quests.each do |quest|
        self.conquered?(metadata, quest) ? metadata['quests']['conquered'] << quest.id : metadata['quests']['current'] << quest.id
      end
      new_quests = quests.collect {|quest| quest.id}
      metadata['quests']['primal'].concat(new_quests)
      # Pass on all conquered and add the next one to the current list if not conquered to
      metadata['quests']['conquered'].each do |id|
        quests = ::Quest.where(:parent => id).all
        # If all children are conquered remove their parent from conquered
        remove_parent = true
        quests.each do |id|
          if metadata['quests']['conquered'].index(id)
            quests.delete(id)
          else
            quest = ::Quest.where(:id => id).first
            if self.conquered?(metadata, quest)
              metadata['quests']['conquered'] << quest.id unless metadata['quests']['conquered'].index(quest.id)
            else
              metadata['quests']['current'] << quest.id unless metadata['quests']['current'].index(quest.id)
              remove_parent = false
            end
          end
        end
        if remove_parent
          # If that was not end of chain, remove it .. else keep it for next quests
          quests = ::Quest.where(:parent => id).all
          metadata['quests']['conquered'].delete(id) if (quests && quests.length > 0)
        end
      end
      ################ This should be removed after we move texts to locales ################
      metadata['quests']['descriptions'] = {}
      metadata['quests']['current'].each do | id |
        quest = ::Quest.where(:id=>id).first
        if quest
          metadata['quests']['descriptions'][id] = {}
          metadata['quests']['descriptions'][id]['name'] = quest.name
          quest_metadata = quest.decoded_metadata
          metadata['quests']['descriptions'][id]['desc'] = ""
          quest_metadata['conditions'].each_pair do | item, conditions |
            if CONDITIONS[:buildings][item]
              metadata['quests']['descriptions'][id]['desc'] =  metadata['quests']['descriptions'][id]['desc'] +
                                                            "Set up " + item + " with following specifications"
              conditions.each_pair do | cond, cond_val|
                metadata['quests']['descriptions'][id]['desc'] =  metadata['quests']['descriptions'][id]['desc'] + ", " +
                                                              cond + " : " + cond_val.to_s
              end
              metadata['quests']['descriptions'][id]['desc'] =  metadata['quests']['descriptions'][id]['desc'] + ". "
            elsif CONDITIONS[:resources].index(item)
              metadata['quests']['descriptions'][id]['desc'] =  metadata['quests']['descriptions'][id]['desc'] + 
                                                            "Gather up to " + conditions.to_s + " " +  item + ". "
            end
          end
        end
      end
      #######################################################################################
      user_game_profile.metadata = Metadata.encode(metadata)
      user_game_profile.save
    end

    def self.conquered?(metadata, quest)
      conquered = true
      quest_metadata = quest.decoded_metadata
      quest_metadata['conditions'].each_pair do | item, conditions |
        if CONDITIONS[:buildings][item]
          if metadata[item]
            metadata[item].each_pair do |key, value|
              condition_met = true
              conditions.each_pair do |cond, cond_val|
                if value[cond] < cond_val
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
      quest_metadata = Metadata.decode(quest.metadata)
      Notification.new( {:metadata => user_game_profile.decoded_metadata,
                         :notification_text => quest.name + " Quest Conquered! You ve earned #{quest_metadata['rewards']['coins']} coins" + 
                                                            " & #{quest_metadata['rewards']['exp']} experience points" } )
      if quest_metadata['rewards']['exp']
        user_game_profile.exp += quest_metadata['rewards']['exp']
      end
      if quest_metadata['rewards']['coins'] 
        user_game_profile.user.coins += quest_metadata['rewards']['coins']
        user_game_profile.user.save
      end
    end

  end

end
