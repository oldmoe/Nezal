require 'require_all'
require 'active_record'
require 'minitest/unit'
require_all 'app/models'

ActiveRecord::Base.establish_connection(YAML::load(File.open('config/database.yml'))['test'])
ActiveRecord::Base.connection.execute("PRAGMA foreign_keys = ON")

MiniTest::Unit.autorun

class IndexesTest < MiniTest::Unit::TestCase
  
  def create_recs
    UserCampaign.destroy_all
    User.destroy_all  
    Game.destroy_all
    # Create 20 games
    (1..10).each do |i|
      game = Game.new(:name => 'test_game' + i.to_s)
      campaign = Campaign.new(:name => 'curr_camp')
      game.current_campaign = campaign
      game.campaigns << campaign
      rank = Rank.new( :name => 'Major', :lower_exp => 0, :upper_exp => 100)
      game.ranks << rank
      game.save!
    end
    # Create 10000 users with profile in each game
    (1..1000).each do |i|
      user = User.create!('service_id' => i.to_s)
    end
    games = Game.find(:all)
    users = User.find(:all)
    games.each do |game|
      users.each do |user|
        # Create a game_profile
        profile = UserGameProfile.create!(:game_id => game.id, :user_id => user.id)
      end
    end
    profiles = UserGameProfile.find(:all)
    profiles.each do |profile|
      # Create a game_profile
      UserCampaign.create(:profile_id => profile.id, :campaign_id => profile.game.campaigns.first().id,
                           :score => profile.id - profile.id%2 , :user_service_id => profile.user.service_id )
    end
  end
  
  def destory_recs
    User.destroy_all  
    Game.destroy_all
  end
  
  ###########################################
  # Create loads of users and profiles
  # retrieve user profiles, make sure index is of use
  ###########################################
  def test_user_game_profile
#=begin
    create_recs
#=end
    puts "============= Test User Game Profile Index ====================="
    user = User.first()
    puts "Using INDEXED BY statement: "
    t = (Time.now.to_f * 10000).to_i
    records = UserGameProfile.find_by_sql( 'SELECT * FROM user_game_profiles indexed by index_user_game_profiles_on_user_id WHERE user_id = ' +
                                            user.id.to_s)
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 - t
    puts records.length
    puts "Using NOT INDEXED statement : "
    t = (Time.now.to_f * 10000).to_i
    records = UserGameProfile.find_by_sql( 'SELECT * FROM user_game_profiles NOT INDEXED WHERE user_id = ' + user.id.to_s )
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 - t
    puts records.length
    puts "Using sql statement with no clue: "
    t = (Time.now.to_f * 10000).to_i
    records = UserGameProfile.find_by_sql(' select * from user_game_profiles where user_id= ' + user.id.to_s )
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 - t
    puts records.length
    t = (Time.now.to_f * 10000).to_i
    puts "Using find_by_user_id: "
    records = UserGameProfile.find_all_by_user_id(user.id.to_s)
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 - t
    puts records.length
=begin
    destroy_recs
=end
  end
   
  def test_user_campaign_score
    puts "============= Test Campaign Score Index ====================="
    camp = UserGameProfile.find(:first).game.campaigns.first()
    puts "Using find_by_sql with no clue statement: "
    t = (Time.now.to_f * 10000).to_i
    recs = UserCampaign.find_by_sql(' select score from user_campaigns where campaign_id= ' + camp.id.to_s  + " order by score  limit 5")
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 -t
    puts "Using SQL statement with NOT INDEXED: "
    t = (Time.now.to_f * 10000).to_i
    recs = UserCampaign.find_by_sql(' select score from user_campaigns  NOT INDEXED where campaign_id= ' + camp.id.to_s  + " order by score  limit 5")
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 -t
    puts "Using SQL statement with INDEXED BY: "
    t = (Time.now.to_f * 10000).to_i
    recs = UserCampaign.find_by_sql('select score from user_campaigns INDEXED BY index_user_campaigns_on_campaign_id_and_score where campaign_id=' + 
                               camp.id.to_s  + " order by score  limit 5")
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 -t
    puts "Using Reguler Interface:"
    t = (Time.now.to_f * 10000).to_i
    recs = UserCampaign.all(:conditions => { :campaign_id => camp.id},:select => 'score', :limit => 5, :order=> :score)
    t2 = (Time.now.to_f * 10000).to_i
    puts t2 -t
  end
  
end
  
