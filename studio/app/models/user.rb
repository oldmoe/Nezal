# Database schema:
#  users

class User < Sequel::Model

  set_primary_key [:app_id, :user_id]
  unrestrict_primary_key

end
