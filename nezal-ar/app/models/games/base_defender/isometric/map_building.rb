module BD
  class MapBuilding
    attr_accessor :name, :owner, :xdim, :ydim, :zdim, :img_width, :img_height, :map_tiles, :hp
    def initialize owner, name, options
      @owner = owner
      @xdim = options['xdim'].to_f
      @ydim = options['ydim'].to_f
      @zdim = options['zdim'].to_f
      @hp = options['hp'].to_f
      @img_width= options['img_width'].to_f
      @img_height= options['img_height'].to_f
      @name = name
    end
  end
end
