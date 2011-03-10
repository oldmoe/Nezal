module BD
  class MapBuilding
    attr_accessor :name, :owner, :xdim, :ydim, :zdim, :map_tiles, :hp
    def initialize owner, name, xdim, ydim, zdim, hp
      @owner = owner
      @xdim = xdim
      @ydim = ydim
      @zdim = zdim
      @hp = hp
      @name = name
    end
  end
end
