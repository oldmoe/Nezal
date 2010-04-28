Gem::Specification.new do |s|
  s.name     = "data_store"
  s.version  = "0.0.1"
  s.date     = "2010-1-13"
  s.summary  = "Berkeley DB library"
  s.email    = "oldmoe@gmail.com"
  s.homepage = "http://github.com/oldmoe/Nezal/data_store"
  s.description = "Berkeley DB library"
  s.has_rdoc = true
  s.authors  = ["Muhammad A. Ali"]
  s.platform = Gem::Platform::RUBY
  s.files    = [ 
		"data_store.gemspec",
    "lib/data_store.rb",
    "lib/data_store/crud.rb",
		"lib/data_store/storable.rb",
		"lib/data_store/query_api.rb",
		"lib/data_store/query_proxy.rb",
    "lib/data_store/environment.rb",
    "lib/data_store/helpers.rb",
    "lib/data_store/relations/relation.rb",
    "lib/data_store/relations/persistor.rb",
		"lib/data_store/relations/query_api.rb",
		"lib/data_store/relations/query_proxy.rb",
    "lib/data_store/relations/one_to_one.rb",
    "lib/data_store/relations/one_to_many.rb",
    "lib/data_store/relations/many_to_one.rb",
    "lib/data_store/relations/many_to_many.rb",
    "lib/data_store/relations/relation_collection.rb",
	]
end

