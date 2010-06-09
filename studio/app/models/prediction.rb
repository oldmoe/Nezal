# Database schema:
#  matches

class Prediction < Sequel::Model

  many_to_one :match
  many_to_one :user, :key=>[:app_id, :user_id]

  def validate
    super
    errors.add(:match, "match inactive") if ( !match.active? )
    errors.add(:kicks_a, 'Kicks not valid in this match') if (kicks_a && !match.accept_kicks?)
    errors.add(:kicks_b, 'Kicks not valid in this match') if (kicks_b && !match.accept_kicks?)
    errors.add(:kicks_a, "!Prediction not valid. Goals of teams not tied") if (goals_a  == goals_b)
    errors.add(:kicks_b, "!Prediction not valid. Goals of teams not tied") if (goals_a  == goals_b)
  end

  def calc_score()  
    match_goals = match.goals_a - match.goal_b
    match_kicks = match.kicks_a - match.kicks_b if ( match.accept_kicks? && match.kicks_a && match.kicks_b)

    goals = goals_a - goals_b 
    kicks = kicks_a - kicks_b if kicks_a && kicks_b
    
    score = if !(match.accept_kicks? && match.kicks_a && match.kicks_b)
              if match.goals_a == goals_a && match.goals_b == goals_b
                3
              elsif match_goals == goals
                2
              elsif match_goals * goals > 0
                1
              elsif kicks && kicks * match_goals > 0 
                1
              else
                -1
              end
            else
              if kicks 
                if match.goals_a == goals_a && match.goals_b == goals_b && match.kicks_a == kicks_a && match.kicks_b == kicks_b
                  6
                else match_kicks == kicks 
                  5
                end
              elsif goals * match_kicks > 0
                1
              else
                -1
              end
              
            end
  end

end
