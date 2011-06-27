module BD
  class MapBuilding
    attr_accessor :name, :owner, :xdim, :ydim, :zdim, :img_width, :img_height, :map_tiles, :hp, :damage
    def initialize owner, name,game_metadata, options
      @game_metadata = game_metadata
      @owner = owner
      @xdim = options['xdim'].to_f
      @ydim = options['ydim'].to_f
      @zdim = options['zdim'].to_f
      @hp = options['hp'].to_f
      @name = name
      @max_hp = @game_metadata['buildings'][@name]['levels'][@owner['level'].to_s]['hp']
      @img_width= options['img_width'].to_f
      @img_height= options['img_height'].to_f
      @damage = 0
    end
    
    def get_stolen_resources
      resources = {}
      if(@name=='lumbermill'||@name=='quarry')
        stolen_resource = 0
        resource = ''
        resource = 'lumber' if(@name=='lumbermill')
        resource = 'rock' if(@name=='quarry')
        stolen_resource = @owner[resource]
        puts "damage #{@damage} max hp #{@max_hp} #{stolen_resource}"
        stolen_resource = (stolen_resource* @game_metadata['battle']['steal_percentage'] * @damage/(@max_hp*1.0)).floor
        resources[resource] = stolen_resource
        @damage = 0
      end
      resources
    end
  end
end
