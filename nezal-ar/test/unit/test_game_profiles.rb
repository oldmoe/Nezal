require 'require_all'
require 'active_record'
require 'minitest/unit'
require_all 'app/models'

ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))['test'])
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON")

MiniTest::Unit.autorun

class UserGameProfileTest < MiniTest::Unit::TestCase
  
  ################################################
  # Create, make sure a user and a game cant be ni;
  ################################################
  def test_create
    # Create the game
    game = Game.new(:name => 'test_game')
    campaign = Campaign.new(:name => 'curr_camp')
    game.current_campaign = campaign
    game.campaigns << campaign
    rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
    game.ranks << rank
    game.save!
    # Create the user
    user = User.create!('service_id' => "fdddddddvcvcddd")
    # Assert no null fields accepted
    assert_raises(ActiveRecord::StatementInvalid) {UserGameProfile.create!(:game_id => game.id)}
    assert_raises(ActiveRecord::StatementInvalid) {UserGameProfile.create!(:user_id => 1)}
    # Create a game_profile
    profile = UserGameProfile.create(:game_id => game.id, :user_id => user.id)
    # Check profile added to the user
    assert_equal user.id, profile.user_id
    assert_equal game.id, profile.game_id
    # Make sure a recreation to a profile for the same campaign throws a validation error
    assert_raises (ActiveRecord::RecordInvalid) { UserGameProfile.create!(:game_id => game.id, :user_id => user.id) }
    user.destroy
    game.destroy
  end
  
  ################################################
  # Add user campaigns
  ################################################  
  def test_profile_campaigns
    game = Game.new(:name => 'test_game')
    campaign = Campaign.new(:name => 'curr_camp')
    game.current_campaign = campaign
    game.campaigns << campaign
    rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
    game.ranks << rank
    game.save!
    # Create the user
    user = User.create!('service_id' => "fdddddddvcvcddd")
    # Create a game_profile
    profile = UserGameProfile.create(:game_id => game.id, :user_id => user.id)
    # Create a user campaign
    user_camp = UserCampaign.new(:user_service_id => user.service_id )
    user_camp.campaign = campaign
    profile.user_campaigns << user_camp
    assert_equal profile.id, user_camp.profile_id
    profile.save!
    assert_equal user_camp.id, UserCampaign.find(profile.user_campaigns.first.id).id
    # Test user_camp deleted after profile deletion
    profile.destroy
    assert_raises (ActiveRecord::RecordNotFound) { UserCampaign.find(profile.user_campaigns.first.id) }
    user.destroy
    game.destroy
  end
  
end
