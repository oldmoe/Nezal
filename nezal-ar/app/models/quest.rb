class Quest < ActiveRecord::Base
    
  include MetadataManager

  belongs_to :game

end
