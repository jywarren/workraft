# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_workraft_session',
  :secret      => '2b8c353e5fd6e4f54372fff7b57c18a40be78c109ed3a07ceaa384bfaf0b6cab6a29c6745cc8b0c0fc37f82f469392fa78b85c554ba176b9d846a356b6574ac9'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
