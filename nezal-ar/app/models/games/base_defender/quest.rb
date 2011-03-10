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
      # Decode metadata, initialize the user quest hash if not found
      user_game_profile.metadata['quests'] ||= {'primal' => [], 'current' => [], 'conquered' => []}
      # Pass by the current quests, check for conquered ones, reward them & move them to conquered ones 
      user_game_profile.metadata['quests']['current'].each do |id|
        quest = ::Quest.where(:id => id).first
        if quest && self.conquered?(user_game_profile, quest)
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
        self.conquered?(user_game_profile, quest) ? 
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
            if self.conquered?(user_game_profile, quest)
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
          user_game_profile.metadata['quests']['descriptions'][id] = quest.metadata
          user_game_profile.metadata['quests']['descriptions'][id]['status'] = self.status(user_game_profile, quest)
          user_game_profile.metadata['quests']['descriptions'][id]['name'] = quest.name
          puts user_game_profile.metadata['quests']['descriptions'][id]
        end
      end
      user_game_profile.save
    end

    def self.conquered?(profile, quest)
      conquered = true
      metadata = profile.metadata
      quest.metadata['conditions']['buildings'].each_pair do | item, conditions |
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
        break unless conquered
      end
      quest.metadata['conditions']['resources'].each_pair do | item, conditions |
        condition_met = true
        condition_met = false if metadata[item] < conditions 
        conquered &= condition_met
        break unless conquered
      end
      conquered
    end

    # Status each condition in the quest
    def self.status(profile, quest)
      status = { :buildings => {}, :resources => {} }
      metadata = profile.metadata
      quest.metadata['conditions']['buildings'].each_pair do | item, conditions |
        status[:buildings][item] = {}
        if metadata[item]
          metadata[item].each_pair do |key, value|
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
      quest.metadata['conditions']['resources'].each_pair do | item, conditions |
        condition_status = { :status => self::STATUS[:done], :value => metadata[item] || 0, :target => conditions}
        if metadata[item] && (metadata[item] < conditions)
          condition_status[:status] = self::STATUS[:not_started]
        end
        status[:resources][item] = condition_status
      end 
      status
    end

    def self.reward(user_game_profile, quest)
      Notification.new( {:metadata => user_game_profile.metadata, :notification_type => "quest",
                         :notification_text => quest.metadata['congratesMsg'], :notification_data => {:rewards => quest.metadata['rewards']} })
      if quest.metadata['rewards']['exp']
        user_game_profile.exp = user_game_profile.exp.to_i + quest.metadata['rewards']['exp']
      end
      if quest.metadata['rewards']['coins'] 
        user_game_profile.user.coins += quest.metadata['rewards']['coins']
        user_game_profile.user.save
      end
      self::REWARDS[:resources].each do | reward |
        if quest.metadata['rewards'][reward]  
          user_game_profile.metadata[reward] += quest.metadata['rewards'][reward].to_i
        end
      end
    end

  end

end
