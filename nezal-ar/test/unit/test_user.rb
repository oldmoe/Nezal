require 'require_all'
require 'active_record'
require 'minitest/unit'
require_all 'app/models'

ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))['test'])

MiniTest::Unit.autorun

class FbUserTest < MiniTest::Unit::TestCase
  
  ################################################
  # Create user, check the correct id
  ################################################
  def test_create
    user = FbUser.create(:fb_id => "1235432759sf")
    assert_equal "1235432759sf", user.fb_id
    user.destroy
  end
  
  ################################################
  # Create user with game profiles
  ################################################
  def test_user_with_game_profiles
    # Prepare game
    game = Game.new(:name => 'test_game')
    campaign = Campaign.new(:name => 'curr_camp')
    game.current_campaign = campaign
    game.campaigns << campaign
    rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
    game.ranks << rank
    game.save!
    # Create the user
    user = FbUser.create(:fb_id => "1235432759sf")
    # Create a game_profile
    profile = UserGameProfile.create(:game_id => game.id, :user_id => user.id)
    # Check profile added to the user
    assert_equal profile.id, user.game_profiles.first().id 
    assert_equal user.id, profile.user_id
    assert_equal game.id, profile.game_id
    # Make sure a recreation to a profile for the same campaign throws a validation error
    assert_raises (ActiveRecord::RecordInvalid) { UserGameProfile.create!(:game_id => game.id, :user_id => user.id) }
    game.destroy
    user.destroy
  end
  
  #################################################
  # Make sure game profiles are deleted upobn deletion of user
  #################################################
  def test_delete
    # Prepare game
    game = Game.new(:name => 'test_game')
    campaign = Campaign.new(:name => 'curr_camp')
    game.current_campaign = campaign
    game.campaigns << campaign
    rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
    game.ranks << rank
    game.save!
    # Create the user
    user = FbUser.create(:fb_id => "1235432759sf")
    # Create a game_profile
    profile = UserGameProfile.create(:game_id => game.id, :user_id => user.id, :rank_id => game.ranks.first.id)
    # Check profile added to the user
    user.destroy
    assert_raises (ActiveRecord::RecordNotFound) { UserGameProfile.find(profile.id) }
  end
  
  #################################################
  # Test Top Scorers
  #################################################
  def test_top_scorers
    destroy_recs
    create_recs
    camp = Campaign.first()
    # Test Top Scorers with empty Id list and default limit
    recs = FbUser.top_scorers(camp.id)
    curr_rec = recs.shift
    while ( next_rec = recs.shift)
      assert_block { curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user ) }
      curr_rec = next_rec
    end
    # Test Top Scorers with empty Id list and a specified limit
    limit = 10
    recs = FbUser.top_scorers(camp.id, [], limit)
    assert_equal limit, recs.length
    curr_rec = recs.shift
    while ( next_rec = recs.shift)
      assert_block { curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user ) }
      curr_rec = next_rec
    end
    # Test Top Scorers with Id list
    ids = FbUser.find(:all, :last, :limit => 10).collect { |user| user.fb_id }
    recs = FbUser.top_scorers(camp.id, ids)
    curr_rec = recs.shift
    assert_equal true, (ids.include? curr_rec.fb_user) if curr_rec
    while ( next_rec = recs.shift)
      assert_block { ( ids.include? next_rec.fb_user ) &&
                     (curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user )) }
      curr_rec = next_rec
    end
    destroy_recs
  end
  
  #################################################
  # Test Ranking
  #################################################
  def test_ranking
    destroy_recs
    create_recs
    camp = Campaign.first()
    # Test Top Scorers with empty Id list and default limit
    recs = FbUser.all(:limit => 20).last.ranking(camp.id)
    rank = 0
    puts recs[:rank]
    # Make sure that the rank is calculated correctly
    UserCampaign.find(:all).each do |rec|
      if (rec.campaign_id == recs[:user_camp].campaign_id && rec.score > recs[:user_camp].score ||
                           (rec.score == recs[:user_camp].score && rec.fb_user < recs[:user_camp].fb_user ) ) 
        rank += 1
      end
    end
    assert_equal rank + 1, recs[:rank]
    # Use the rank to make sure that the previous & next in the ranking are retrieved correctly
    recs[:previous].each_index do |i|
      ranking = FbUser.find_by_fb_id(recs[:previous][i].fb_user).ranking(camp.id)
      assert_equal (recs[:rank] - 5 + i ), ranking[:rank]
    end
    recs[:next].each_index do |i|
      ranking = FbUser.find_by_fb_id(recs[:next][i].fb_user).ranking(camp.id)
      assert_equal recs[:rank] + i +1 , ranking[:rank] 
    end

=begin
    curr_rec = recs.shift
    while ( next_rec = recs.shift)
      assert_block { curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user ) }
      curr_rec = next_rec
    end
    # Test Top Scorers with empty Id list and a specified limit
    limit = 10
    recs = FbUser.top_scorers(camp.id, [], limit)
    assert_equal limit, recs.length
    curr_rec = recs.shift
    while ( next_rec = recs.shift)
      assert_block { curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user ) }
      curr_rec = next_rec
    end
    # Test Top Scorers with Id list
    ids = FbUser.find(:all, :last, :limit => 10).collect { |user| user.fb_id }
    recs = FbUser.top_scorers(camp.id, ids)
    curr_rec = recs.shift
    assert_equal true, (ids.include? curr_rec.fb_user) if curr_rec
    while ( next_rec = recs.shift)
      assert_block { ( ids.include? next_rec.fb_user ) &&
                     (curr_rec.score > next_rec.score  || (curr_rec.score == next_rec.score && curr_rec.fb_user < next_rec.fb_user )) }
      curr_rec = next_rec
    end
=end
    destroy_recs
  end
  
  def create_recs
    game = Game.new(:name => 'test_game')
    campaign = Campaign.new(:name => 'curr_camp')
    game.current_campaign = campaign
    game.campaigns << campaign
    rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
    game.ranks << rank
    game.save!
    # Create 50 users with profile in each game
    (1..50).each do |i|
      user = FbUser.create!('fb_id' => i.to_s)
    end
    users = FbUser.find(:all)
    users.each do |user|
      # Create a game_profile
      profile = UserGameProfile.create!(:game_id => game.id, :user_id => user.id)
    end
    profiles = UserGameProfile.find(:all)
    profiles.each do |profile|
      # Create a game_profile
      UserCampaign.create(:profile_id => profile.id, :campaign_id => profile.game.campaigns.first().id,
                           :score => profile.id - profile.id%2 , :fb_user => profile.user.fb_id )
    end
  end
  
  def destroy_recs
    FbUser.destroy_all  
    Game.destroy_all
  end
  
  
end
