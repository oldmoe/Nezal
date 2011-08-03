Gem::Specification.new do |s|
  s.name     = "data_store"
  s.version  = "0.0.1"
  s.date     = "2011-6-21"
  s.summary  = "Data store library."
  s.email    = "oldmoe@gmail.com"
  s.homepage = "http://github.com/oldmoe/reactor"
  s.description = "Data store library."
  s.has_rdoc = false
  s.authors  = ["Muhammad A. Ali"]
  s.platform = Gem::Platform::RUBY
  s.files    = [ 
		"data_store.gemspec", 
		"lib/data_store.rb", 
    "lib/model.rb",
    "lib/index.rb",
    "lib/drivers/generic.rb",
    "lib/drivers/sqlite.rb",
    "lib/drivers/memory.rb",
    "lib/drivers/redis.rb",
    "lib/drivers/bdb.rb"
	]
  s.rdoc_options = ["--main"]
end

