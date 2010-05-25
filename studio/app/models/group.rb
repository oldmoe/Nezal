# Database schema:
#  groups

class Group < Sequel::Model
    one_to_many :matches
end
