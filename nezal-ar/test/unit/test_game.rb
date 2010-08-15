require 'require_all'
require 'active_record'
require 'minitest/unit'
require_all 'app/models'

ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))['test'])

MiniTest::Unit.autorun

class GameTest < MiniTest::Unit::TestCase
  
  ################################################
  # Test Save
  # Save accepted and performed correctly with campaign
  # Campaign also must be added to the game campaigns before saving
  ################################################
  def test_create
    campaign = Campaign.new(:name => 'curr_camp')
    game = Game.new(:name => 'test_game')
    game.current_campaign = campaign
    game.campaigns << campaign
    game.save
    assert_equal campaign.game.id, game.id
    assert_equal game.current_campaign.id, campaign.id
    game.destroy
    # Check that adding no current campaign creates one and adds it to the game list of campaigns
    game = Game.new(:name => 'test_game')
    game.save!
    assert_equal false, game.campaigns.empty?
    assert_equal game.current_campaign.id, game.campaigns.find(:first).id
    game.destroy
  end
  
  ################################################
  # Test adding campaigns to game campaigns
  ################################################
  def test_add_campaigns 
    campaign = Campaign.new(:name => 'camp_1')
    game = Game.new(:name => 'test_game')
    game.current_campaign = campaign
    game.campaigns << campaign
    campaign2 = Campaign.new(:name => 'camp_2')
    game.campaigns << campaign2
    game.save!
    assert_equal campaign2.game.id, game.id
    assert_equal campaign2.game.id, game.id
    assert_equal  game.campaigns.find(campaign.id).id, campaign.id
    assert_equal  game.campaigns.find(campaign2.id).id, campaign2.id
    game.destroy
  end
  
  ################################################
  # Test campaigns destroyed upon game destruction
  ################################################
  def test_delete
    campaign = Campaign.new(:name => 'camp_1')
    game = Game.new(:name => 'test_game')
    game.current_campaign = campaign
    game.campaigns << campaign
    campaign2 = Campaign.new(:name => 'camp_2')
    game.campaigns << campaign2
    game.save!
    game.destroy
    assert_raises (ActiveRecord::RecordNotFound) { Campaign.find(campaign.id) }
    assert_raises (ActiveRecord::RecordNotFound) { Campaign.find(campaign2.id) }
  end
  
end
