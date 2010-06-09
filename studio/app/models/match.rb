require  'tzinfo'
# Database schema:
#  matches

class Match < Sequel::Model

  TIME_LIMIT = { :start => 60*60*48, :end => -60*5 }

  many_to_one :team_a, :class => Team
  many_to_one :team_b, :class => Team
  many_to_one :location
  many_to_one :group
  
  def active?
    time_difference = remaining
    time_difference < TIME_LIMIT[:start] && time_difference > TIME_LIMIT[:end]
  end
  
  def remaining
  	start_time + start_time.clone.utc_offset - TZInfo::Timezone.get( 'Africa/Johannesburg').utc_to_local(Time.now.utc)
  end

  def status
	  time_difference = remaining
	  if self.goals_a.nil? && time_difference > TIME_LIMIT[:start]
		  'closed'
	  elsif self.goals_a.nil? &&  time_difference <= TIME_LIMIT[:start] && time_difference >= TIME_LIMIT[:end]	
		  'open'
	  elsif self.goals_a.nil? && time_difference < TIME_LIMIT[:end] && self.goals_a.nil?
		  'started'
	  else
		  'finished'
	  end
  end

  def finish()
    limit = 1
    offset = 0
    predictions = Prediction.filter({:match_id => self[:id]}).limit(limit).all
    predictions.each { |prediction| prediction.calc_score(self) }
    while predictions.length >= 50 
      offset += limit
      predictions = Prediction.filter({:match_id => self[:id]}, offset).limit(limit).all
      predictions.each { |prediction| prediction.calc_score(self) }
    end
  end
  
  def accept_kicks?
    return !(('A'..'H').include? group.name)
  end

end
