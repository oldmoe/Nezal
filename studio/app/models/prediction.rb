# Database schema:
#  matches

class Prediction < Sequel::Model

  many_to_one :match
  many_to_one :user, :key=>[:app_id, :user_id]

end
