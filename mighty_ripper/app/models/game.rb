# Game persistor
class Game
  include Bdb::Persistable

  def initialize(name, description, image)
    new_image = Image.new(image).image
    game =  { :value => {:name => name, :description => description, :image => new_image[:filename] } }
    @game = self.class.create(game)
    court = Court.new(@game[:key], name, description)
    @game
  end
  
end

