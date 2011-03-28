module BD
  class MapBuilding
    attr_accessor :name, :owner, :xdim, :ydim, :zdim, :img_width, :img_height, :map_tiles, :hp
    def initialize owner, name, options
      @owner = owner
      @xdim = options['xdim']
      @ydim = options['ydim']
      @zdim = options['zdim']
      @hp = options['hp']
      @img_width= options['img_width']
      @img_height= options['img_height']
      @name = name
    end
  end
end
