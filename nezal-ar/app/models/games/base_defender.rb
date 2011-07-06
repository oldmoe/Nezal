require "json"

class BaseDefender < Metadata

  @@game_name = 'base-defender'
  @@speed_factor = 1
  @@resource_building_modules = {
    "quarry" => BD::Quarry,
    "lumbermill" => BD::Lumbermill
  }
  @@wedges = {
    'wedge' => BD::Wedge.new('wedge'),
    'gaddafi' => BD::Wedge.new('gaddafi')
  }
  @@building_modules = ( {
    "townhall" => BD::Townhall,
    "storage" => BD::Storage ,
    "defense_center" => BD::DefenseCenter,
    "war_factory" => BD::WarFactory,
    "house" => BD::House,
    "palm" => BD::Palm,
    "garage" => BD::Garage, 
    "defense_research" => BD::DefenseResearch,
    "military_research" => BD::MilitaryResearch
  }.merge @@resource_building_modules ).merge @@wedges
  
  def self.building_modules
    @@building_modules
  end
  
  def self.land_marks
    {
      "grass" => 0,
      "water" => 1,
      "rock" => 2,
      "lumber" => 3
    }
  end
  
  def self.process_request (profile, data)
    data = self.decode(data)
    result = {}
    if data['request'] == 'neighbor_empire'
      result = BD::Neighbor.neighbor_empire(profile, data)
    elsif data['request'] == 'friends'
      result = BD::Neighbor.friends(profile)
    end
    return JSON.generate(result);
  end
  
  def self.convert_location( location )
    @@adjustment_size = 4
    if location.class == String
      parts = location.split(/:/)
      return parts[0].to_i, parts[1].to_i
    else
      x = location['x']
      y = location['y']
      return x.to_s.rjust( @@adjustment_size, '0' ) + ':' + y.to_s.rjust( @@adjustment_size, '0' )
    end
  end
  
  def self.edit_game_profile(user_game_profile, data)
    data = self.decode(data)
    case data['event']
    when 'upgrade'
      validation = upgrade_building(user_game_profile, data)
    when 'move' 
      validation = move_building(user_game_profile, data)
    when 'buy_worker'
      validation = buy_worker(user_game_profile)
    when 'assign_worker'
      validation = assign_worker(user_game_profile, data)
    when 'collect_resources'
      validation = collect_building(user_game_profile, data)
    when 'notification_ack'
      validation = Notification.delete({:profile => user_game_profile, :id => data['id']})
    when 'use_reward'
      validation = BD::RewardBag.use({:profile => user_game_profile, :id => data['id']})
    when 'attack'
      repair_jobs user_game_profile
      validation = initialize_simulate_attack user_game_profile, data
    when 'repair_buildings'
      validation = repair_buildings user_game_profile
    when 'reward_bag'
      validation = add_reward_bag user_game_profile, data
    when 'list_map'
      validation = list_map user_game_profile, data
    when 'start_research'
      validation = BD::Research.start user_game_profile, data['name']
    when 'cancel_research'
      validation = BD::Research.cancel user_game_profile, data['name']
    end
    
    user_game_profile.error= validation['valid'] ? validation['error'] :  nil
    BD::Quest::assess_user_quests user_game_profile
    #### TODO We need to check why they need the stringified one 
    #### and see what we gonna do about that
    user_game_profile.save
  end
  
  def self.initialize_simulate_attack user_game_profile, data
    profile_metadata = nil
    validation = nil
    if(user_game_profile.metadata['protection']['working'])
      user_game_profile.metadata['protection']['working'] = false
      user_game_profile.metadata['protection']['started'] = 0
      user_game_profile.metadata['protection']['time'] = 0
    end
    if(!data['user_id'].nil?)
      user_id = data['user_id'].to_i
      neighbor_profile = BD::Neighbor.neighbor_profile(user_game_profile, data)
      profile_metadata  = neighbor_profile.metadata
      user_game_profile.metadata['attack_history'] = {} if(user_game_profile.metadata['attack_history'].nil?)
      profile_metadata['attack_history'] = {} if(profile_metadata['attack_history'].nil?)
      if(!user_game_profile.metadata['attack_history'][user_id].nil?)
        user_game_profile.metadata['attack_history'][user_id]['attacked']+=1
        pofile_metadata['attack_history'][user_game_profile.id.to_i]['defended']+=1
      else
        user_game_profile.metadata['attack_history'][user_id] = {'attacked'=>1,'defended'=>0}
        profile_metadata['attack_history'][user_game_profile.user_id.to_i] = {'attacked'=>0,'defended'=>1}
      end
      attack_result = simulate_attack profile_metadata, user_game_profile, data
      check_protection profile_metadata
      notification_text = ''
      if(attack_result['attack_success'])
        notification_text = "You have been attacked by ${name}, prepare your defenses better to defend yourself."
      else
        notification_text = "You have been attacked by ${name}, but your defenses crushed the attackers before they harm your base."
      end
          Notification.new( {:metadata => profile_metadata, :notification_type => "attack",
                         :notification_text => notification_text,
                        :notification_data =>{:attacker_id => user_game_profile.user.service_id} })
      neighbor_profile.save
    else
      profile_metadata = user_game_profile.metadata
      attack_result = simulate_attack profile_metadata,my_metadata, data
    end
    attack_result['validation']
  end
  
  def self.check_protection profile_metadata 
      total_max_hp = 0
      total_hp=0
      building_modules.keys.each do |building_name|
        if(!profile_metadata[building_name].nil?)
            buildings = profile_metadata[building_name]
            building_data = Game::current.buildings[building_name]['levels']
            buildings.each_pair do |k,v|
              total_hp+=v['hp']
              total_max_hp+=building_data[v['level'].to_s]['hp']
            end
        end
      end
      if(total_hp/(total_max_hp*1.0)<0.5)
        profile_metadata['protection'] = {'started'=>Time.now.utc.to_i ,'time'=> 8*3600, 'working'=>true}
      end
  end
  
  def self.simulate_attack profile_metadata, ugp, data
    my_metadata = ugp.metadata
    creeps_coords = data['creeps']
    research_hp_bonus = BD::Research.total_hp_bonus( profile_metadata )
    map = BD::Map.new profile_metadata['map']
    building_names = @@game_metadata['buildings'].keys
    creeps = []
    i=0
    creeps_coords.each do |creep|
      creep_class = eval("BD::"+creep['type'])
      creep_name = creep['type'][0].downcase << creep['type'][1...creep['type'].length]
      my_metadata['creeps'][creep_name]-=1
      my_metadata['garage_units_used']-=@@game_metadata['creeps'][creep_name]["garage_units"]
      my_metadata['garage_units_used'] = 0 if my_metadata['garage_units_used'] < 0 
      creeps.push(creep_class.new(map,creep['x'],creep['y'],i,@@game_metadata))
      i = i+1
    end
    first_garage_coords = my_metadata['garage'].keys[0]
    garage = BD::Garage.new my_metadata['garage'][first_garage_coords]['coords'], ugp
    garage.check_stopped_war_factories ugp, @@game_metadata
    weapons = []
    building_names.each do |building_name|
      if(!profile_metadata[building_name].nil?)
        profile_metadata[building_name].values.each do |building|
          display = @@game_metadata['buildings'][building_name]['levels'][building['level'].to_s]['display']
          options = {
            'xdim' => display['xdim'],
            'ydim' => display['ydim'],
            'zdim' => display['zdim'],
            'img_width' => display['imgWidth'],
            'img_height' => display['imgHeight'],
            'hp' => building['hp'] + building['hp']* research_hp_bonus / 100
          }
          map_building = BD::MapBuilding.new building, building_name, @@game_metadata, options
          map.add_element map_building
          if @@wedges[building_name]
            weapons << BD::Weapon.new(map_building, creeps)
          end
        end
      end
    end
    done = false
    weapons.each do |weapon|
      #puts weapon.coords
      weapon.tick
    end
    weapons.each do |weapon|
      weapon.display_tick
    end
    while(!done)
      #puts "=======================New LOOP=================="
      done = true
      weapons.each do |weapon|
        weapon.tick
      end
      creeps.each do |creep|
        creep.tick
        if(!creep.done_attack)
          done=false
        end
      end
      weapons.each do |weapon|
        weapon.display_tick
      end
    end
    #puts "=====================FINISHED========================="
    attack_success = false
    stolen_resources = {}
    creeps.each do |creep|
      add_stolen_resources(stolen_resources, creep.stolen_resources)
      if(creep.attacked)
        attack_success=true
      end
    end
    bag_won = false
    stolen_resources.each do |k,v|
      if(v>0)
        bag_won = true
      end
    end
    if(bag_won)
     BD::RewardBag.new({ :profile => ugp, :reward_data => stolen_resources })
    end
    puts "stolen resources: #{stolen_resources}"
    map.objects.each do |obj|
      #puts "#{obj.name}  #{obj.hp}"
      key = self.convert_location(obj.owner['coords'])
      if(obj.name=='palm' && obj.hp <=1)
        profile_metadata[obj.name].delete(key)
      else
        profile_metadata[obj.name][key]['hp'] = obj.hp
      end
    end
    return {'attack_success'=> attack_success, 'validation'=>{'valid' => true, 'error' => ''}}
  end
  
  def self.add_stolen_resources total_stolen,resources
    resources.each_pair do |resource,val|
      if(total_stolen[resource].nil?)
         total_stolen[resource] = 0
     end
     total_stolen[resource]+=val
    end
  end

  
  def self.buy_worker(user_game_profile)
    return BD::WorkerFactory.buy_worker(user_game_profile);
  end
  
  # {'building' : 'lumbermill', 'coords' : {'x':'', 'y':''} }
  def self.assign_worker(user_game_profile, data)
    name = data['building']
    return @@building_modules[name].assign_worker(user_game_profile, data['coords'])
  end
  
  # {'building' : 'townhall', 'coords' : {'x':'', 'y':''} }
  def self.upgrade_building(user_game_profile, data)
    building = data['building']
    coords = data['coords']
    name = data['building']
    building = user_game_profile.data[name]
    location = self.convert_location(coords)
    if building.nil? || building[location].nil?
      validation = @@building_modules[name].build(user_game_profile, data['coords'])
      return validation
    else
      validation = @@building_modules[name].upgrade(user_game_profile, data['coords'])
      return validation
    end
  end
  
  def self.collect_building(user_game_profile, data)
    building = data['building']
    coords = data['coords']
    @@building_modules[building].collect(user_game_profile, coords)
  end
  
  def self.collect_neighbor_building(user_game_profile, neighbor_profile, data)
    if( user_game_profile.metadata['xp_info']['energy'] > 0 )
      building = data['building']
      coords = data['coords']
      reward_data = {}
      location_hash = BaseDefender.convert_location(coords)
      building_data = neighbor_profile.metadata[building][location_hash]
      reward_data[@@building_modules[building].collects] = (building_data[@@building_modules[building].collects]/100).to_i
      @@building_modules[building].collect(neighbor_profile, coords)
      BD::RewardBag.new({ :profile => user_game_profile, :reward_data => reward_data })
      user_game_profile.metadata['xp_info']['energy'] -= 1
      user_game_profile.save
    end
    BD::Neighbor.neighbor_empire(user_game_profile, data)
  end

  def self.move_building(user_game_profile, data)
    name = data['building']
    validation = @@building_modules[name].move(user_game_profile, name, data['coords'], data['oldCoords'])
    return validation
  end
  
  def self.add_reward_bag user_game_profile, data
    user_game_profile['reward_bag']  
  end
  
  def self.list_map user_game_profile, data
    friend_ids = data['friend_ids']
    
    attack_history = user_game_profile.metadata['attack_history']
    for user in attack_hitory.keys
      
    end
  end

end
