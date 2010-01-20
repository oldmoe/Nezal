class Image

  PATH = ::File.dirname(::File.dirname(::File.dirname(__FILE__))) + ::File::SEPARATOR + "public/game_images"
  
  attr_reader :image

  def initialize(image)
    @image = (image && image[:filename])? image : {:filename => "default.jpg"}
    file = File.new( PATH + ::File::SEPARATOR + @image[:filename], "w" )
    if @image[:tempfile]
      while read = @image[:tempfile].read(65536)
        file.write(read)
      end
    end
    file.close
  end
  
end
