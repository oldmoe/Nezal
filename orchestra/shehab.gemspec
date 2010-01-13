Gem::Specification.new do |s|
  s.name     = "shehab"
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
		"shehab.gemspec", 
		"README",
		"lib/configurator.rb",
    "lib/connection.rb",
    "lib/daemonizer.rb",
    "lib/http_connection.rb",
    "lib/maestro.rb",
    "lib/musician.rb",
    "lib/overture.rb",
    "lib/rack_connection.rb",
    "lib/runner",
    "lib/server.rb",
    "lib/shehab.rb",
    "lib/tcp_server.rb",
    "lib/test.rb",
    "lib/unix_server.rb"

	]
  s.rdoc_options = ["--main", "README"]
  s.extra_rdoc_files = ["README"]
end

