# Database schema:
#  comments

class Comment < Sequel::Model

  TIME_STAMP = 100 * 60
  USER_TIMEOUT = 100 * 30

  many_to_one :match
  many_to_one :user, :key => [:app_id, :user_id]

  def acceptable?
    invalid = 0
    if message
      message.split.each do |word| 
        invalid += 1 if (DICTIONARY[word])  
      end
    end
    time_limit = (Time.now.to_f * 100).to_i - USER_TIMEOUT
    count = self.class.filter([ {:app_id => user[:app_id]}, {:user_id => user[:user_id]},
                 {:match_id => self[:match_id]}, " time > #{time_limit}" ] ).count
    invalid += 1 if (count != 0)
    (invalid > 0) ? false : true
  end  
  
  def self.after( app_id, match_id, comment_id = nil, limit=10 )
    conditions = [ {:app_id => app_id}, {:match_id => match_id} ]
    conditions << " id > #{comment_id}" if comment_id
    self.filter( conditions ).order(:time.desc).limit(limit).all
  end
  
  def self.time
    (Time.now.to_f*100).to_i
  end

end
