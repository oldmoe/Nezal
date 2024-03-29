# Database schema:
#  matches

class Prediction < Sequel::Model

  many_to_one :match
  many_to_one :user, :key=>[:app_id, :user_id]

  def acceptable?
    errors.add(:match, "match inactive") if ( !match.active? )
    if !match.accept_kicks?   
      self.kicks_a = nil
      self.kicks_b = nil
    end
    if self.goals_a != self.goals_b
      self.kicks_a = nil 
      self.kicks_b = nil
    end
    if match.accept_kicks? && self.goals_a == self.goals_b && self.kicks_a == self.kicks_b
      errors.add(:kicks_b, "!Prediction not valid. Goals of teams not tied")
    end
  	return errors.length == 0
  end

  def calc_score(match)  
    match_goals = match.goals_a - match.goals_b
    match_kicks = match.kicks_a - match.kicks_b if ( match.accept_kicks? && match.kicks_a && match.kicks_b)

    goals = goals_a - goals_b 
    kicks = kicks_a - kicks_b if kicks_a && kicks_b
    
    score_points = if match.goals_a == goals_a && match.goals_b == goals_b
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
            
   score_points += if match_kicks
              if !kicks_a 
                match_kicks * goals > 0 ? 1 : 0
              else
                match_kicks * kicks > 0 ? 2 : 0
              end
            else
              0
            end
    self.score= score_points
    self.save
    user[User::SCORE_FIELDS[match.group.id]] += score_points
    user[:global_score] += score_points
    user.save
  end

end
