Gem::Specification.new do |s|
  s.name     = "shihabd"
  s.version  = "0.0.1"
  s.date     = "2010-1-13"
  s.summary  = "A pure Ruby reactor library"
  s.email    = "oldmoe@gmail.com"
  s.homepage = "http://github.com/oldmoe/reactor"
  s.description = "A simple, fast reactor library in pure Ruby"
  s.has_rdoc = true
  s.authors  = ["Muhammad A. Ali"]
  s.platform = Gem::Platform::RUBY
  s.files    = [ 
		"shihabd.gemspec", 
		"README",
    "lib/connection/connection.rb",
    "lib/connection/rack_connection.rb",
    "lib/connection/http_connection.rb",
    "lib/server/server.rb",
    "lib/server/tcp_server.rb",
    "lib/server/unix_server.rb",
    "lib/orchestra/maestro.rb",
    "lib/orchestra/musician.rb",
		"lib/orchestra/configurator.rb",
    "lib/orchestra/shehab.rb",
    "lib/orchestra/daemonizer.rb",
    "lib/orchestra/runner",
    "lib/orchestra/overture.rb",

	]
  s.rdoc_options = ["--main", "README"]
  s.extra_rdoc_files = ["README"]
end

