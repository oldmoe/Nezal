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
    time_difference = start_time.utc - TZInfo::Timezone.get( 'Africa/Johannesburg').utc_to_local(Time.now.utc)
    time_difference < TIME_LIMIT[:start] && time_difference > TIME_LIMIT[:end]
  end
  
  def remaining
	start_time.utc - TZInfo::Timezone.get( 'Africa/Johannesburg').utc_to_local(Time.now.utc)
  end

  def status
	time_difference = remaining
	if time_difference > TIME_LIMIT[:start]
		'closed'
	elsif time_difference <= TIME_LIMIT[:start] && time_difference >= TIME_LIMIT[:end]	
		'open'
	elsif time_difference < TIME_LIMIT[:end] && self.goals_a.nil?
		'started'
	else
		'finished'
	end
  end
  
  def accept_kicks?
    return !(('A'..'H').include? group.name)
  end

end
