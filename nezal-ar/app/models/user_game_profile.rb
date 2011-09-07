class UserGameProfile < DataStore::Model

  SEP = '-'.freeze

  index :timeline_score, :method => :timeline_index
  index :racing_score, :method => :racing_index
  index :cooperation_score, :method => :cooperation_index
  index :global_score, :method => :score_index

  def game_key  
    splits = key.split(self.class::SEP)
    splits[1, splits.size-2].join(self.class::SEP)
  end

  def user
    key_parts = key.split(self.class::SEP)
    @user ||= User.get(User.generate_key(key_parts.first, key_parts.last))
  end

  def service_type
    key.split(self.class::SEP).first
  end

  def service_id
    key.split(self.class::SEP).last
  end

  def timeline_index
    rank_index(format(scores['timeline']))
  end

  def racing_index
    rank_index(format(scores['racing']))
  end

  def cooperation_index
    rank_index(format(scores['cooperation']))
  end

  def score_index
    rank_index(format(scores['global']))
  end

  def rank_index(rank)
    self.class.generate_key(service_type,  Game::current.key, rank)
  end

  def format(key)
    if key.is_a? Integer
      key = sprintf("%8s", key.to_s(36))
    end
    key
  end

  def init
    time = Time.now.to_i
=begin
    @data ||= { 'scores' => { 'timeline'=>0, 'racing'=>0, 'cooperation'=>0, 'global'=>0,
                             'update_time'=> { 'timeline'=>time, 'racing'=>time, 'cooperation'=>time, 'global'=>time} 
                            } 
              }
=end
    # generate random scores for now
    @data ||= { 'scores' => generate_scores }
    save
  end

  def generate_scores 
    time = Time.now.to_i
    scores = { 'update_time' => {} }
    ['timeline', 'racing', 'cooperation', 'global'].each do |mode|
      scores[mode] = (rand * 100).to_i 
      scores['update_time'][mode] = time
    end
    scores
  end
 
  def global_scores(game_mode, count)
#    after_users = filterAppProfiles(self.previous(game_mode + '_score', count)).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
#    before_users = filterAppProfiles(self.next(game_mode + '_score', count)).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    top_users = filterAppProfiles(self.class.last(game_mode + '_score', count)).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    puts top_users
    { :before => before_users, :after => after_users, :top => top_users }
  end

  def friends(ids)
    game = Game::current
    records = []
    ids.each do |id|
      record = self.class.get(self.class.generate_key(service_type, Game::current.key, id))
      records << record unless record.nil?
    end
    records.collect { |record| { 'service_id' => record.service_id, 'scores' => record.scores } }
  end

  def filterAppProfiles(list)
    appProfiles = []
    appProfiles = list.select { |record|
                record.service_type == service_type && record.game_key == game_key } 
    appProfiles
  end

  class << self

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end

end
