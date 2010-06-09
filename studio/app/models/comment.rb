# Database schema:
#  comments

class Comment < Sequel::Model

  TIME_STAMP = 100 * 60
  USER_TIMEOUT = 100 * 30

  many_to_one :match
  many_to_one :user, :key => [:app_id, :user_id]

  def validate
    super
    invalid = 0
    if message
      message.split.each do |word| 
#        invalid+=1 if (DICTIONALY[word])  
      end
    end
  end  
  
  def self.after( app_id, match_id, comment_id = nil, limit=100 )
    conditions = [ {:app_id => app_id}, {:match_id => match_id} ]
    conditions << " id > #{comment_id}" if comment_id
    self.filter( conditions ).order(:time.desc).limit(limit).all
  end

end
