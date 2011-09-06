class UserGameProfile < DataStore::Model

  SEP = '-'.freeze

  index :timeline_score, :method => :timeline_index
  index :racing_score, :method => :racing_index
  index :cooperation_score, :method => :cooperation_index
  index :global_score, :method => :score_index

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
    rank_index(scores['timeline'])
  end

  def racing_index
    rank_index(scores['racing'])
  end

  def cooperation_index
    rank_index(scores['cooperation'])
  end

  def score_index
    rank_index(scores['global'])
  end

  def rank_index(rank)
   self.class.generate_key(service_type, rank)
  end

  def init
    time = Time.now.to_i
    @data ||= { 'scores' => { 'timeline'=>0, 'racing'=>0, 'cooperation'=>0, 'global'=>0,
                             'update_time'=> { 'timeline'=>time, 'racing'=>time, 'cooperation'=>time, 'global'=>time} 
                            } 
              }
    save
  end
 
  def global_scores(game_mode, count)
    after_users = self.previous(game_mode + '_score', count).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    before_users = self.next(game_mode + '_score', count).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    top_users = self.class.last(game_mode + '_score', count).collect { |record| {'service_id' => record.service_id, 'scores' => record.scores} }
    { :before => before_users, :after => after_users, :top => top_users }
  end

  def friends(ids)
    game = Game::current
    records = []
    ids.each do |id|
      puts self.class.generate_key(service_type, Game::current.key, id)
      record = self.class.get(self.class.generate_key(service_type, Game::current.key, id))
      records << record unless record.nil?
    end
    records << self
    records.collect { |record| { 'service_id' => record.service_id, 'scores' => scores } }
  end

  class << self

    def generate_key(*args)
      args.join(SEP)
    end    
  
  end

end
