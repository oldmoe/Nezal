class Game < ActiveRecord::Base
  
  attr_accessible :name, :description

  has_many   :ranks, :dependent => :destroy, :autosave => true
  has_many   :campaigns, :dependent => :destroy, :autosave => true
  belongs_to    :current_campaign, :class_name => "Campaign", :foreign_key => "current_campaign_id",  :autosave => false
 
  before_validation do
    if ( self.current_campaign.nil? && self.campaigns.empty? )
      campaign = Campaign.new(:name => 'curr_camp')
      self.campaigns << campaign  
      self.current_campaign = campaign
    elsif ( self.current_campaign.nil? ) 
      self.current_campaign = self.campaigns.first()
    end
  end
 
  validates_each :current_campaign do |record, attr, value|
    record.errors.add attr, 'Current campaign must be one of the game campaigns' unless (record.campaigns.include? value)
  end
  
  # Save the current_campaign object
  after_save do
    unless self.current_campaign.game &&   self.id == self.current_campaign.game.id
      self.current_campaign.game = self 
      self.current_campaign.save
    end
    unless self.current_campaign_id == self.current_campaign.id 
      self.current_campaign_id = self.current_campaign.id
      self.save
    end
  end  
  
end
