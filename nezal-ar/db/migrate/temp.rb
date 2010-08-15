=begin
    execute " CREATE TABLE `user_game_profiles` (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             score INTEGER DEFAULT 0,
             game_id INTEGER  NOT NULL,
             user_id varchar(255) NOT NULL,
             FOREIGN KEY(user_id) REFERENCES  fb_users(id))"
=end

ActiveRecord::Base.connection.tables.each do |table|
  puts ActiveRecord::Base.connection.indexes(table).inspect
end
