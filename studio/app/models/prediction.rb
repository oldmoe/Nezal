# Database schema:
#  matches

class Prediction < Sequel::Model

  many_to_one :match
  many_to_one :user, :key=>[:app_id, :user_id]

  def validate
    super
    errors.add(:match, "match inactive") if ( !match.active? )
    kicks_a = nil if (!match.accept_kicks?) 
    kicks_b = nil if (!match.accept_kicks?) 
    (kicks_a = kicks_b = nil) if (goals_a  !=  goals_b)
    if match.accept_kicks? && goals_a == goals_b && kicks_a == kicks_b
      errors.add(:kicks_b, "!Prediction not valid. Goals of teams not tied")
    end
  end

  def calc_score(match)  
    match_goals = match.goals_a - match.goals_b
    match_kicks = match.kicks_a - match.kicks_b if ( match.accept_kicks? && match.kicks_a && match.kicks_b)

    goals = goals_a - goals_b 
    kicks = kicks_a - kicks_b if kicks_a && kicks_b
    
    score = if match.goals_a == goals_a && match.goals_b == goals_b
              3
            elsif match_goals == goals
              2
            elsif match_goals * goals > 0
              1
            elsif kicks && kicks * match_goals > 0 
              1
            else
              0
            end
            
   score += if match_kicks
              if !kicks_a 
                match_kicks * goals > 0 ? 1 : 0
              else
                match_kicks * kicks > 0 ? 2 : 0
              end
            else
              0
            end
    user[User::SCORE_FIELDS[match.group.id]] += score
    user.save
  end

end
