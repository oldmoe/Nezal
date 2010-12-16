class Quest < ActiveRecord::Base

  belongs_to :game
  
  def decoded_metadata 
    @decoded_metadata ||= Metadata.decode(self.metadata)
  end

end
