# Database schema:
#  matches

class Match < Sequel::Model

  many_to_one :team_a, :class => Team
  many_to_one :team_b, :class => Team
  many_to_one :location
  many_to_one :group

end
