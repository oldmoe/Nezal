# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_Nezal_session',
  :secret      => 'a00cbca1c030a01984497457196d66c7ef0e07b68c1ff0a50211a6c28c724c4b2fc8dbc05079e8b5918b99b6ad228f9092f54e9efb835ce13190916a3968ad7d'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
