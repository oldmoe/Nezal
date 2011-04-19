# coding: utf-8
require 'active_record'
require 'yajl'

unless ENV['env'] 
	ENV['env'] = 'development'
end
ActiveRecord::Base.establish_connection({
		:adapter => 'sqlite3',
		:database => "db/#{ENV['env']}.sqlite3"
})

require Dir.pwd + '/app/models/campaign'
require Dir.pwd + '/app/models/game'


@base = Dir.pwd + "/public/city-defender/"

@game_name = ENV['app']
unless @game_name
	@game_name =  ENV['env'] == 'production' ? "defenderofarabia" : "ie-city-defender"
end 
STDERR.puts "Generating campaign list for #{@game_name}"

def generate_campaigns
	game = Game.find_by_name(@game_name)
	campaigns = Campaign.where(:game_id => game.id).order(:id).all.collect{|c|{name:c.name, path:c.path}}.reverse
	puts campaigns.inspect
	campaigns.shift
	campaigns.each do |campaign|
		['english', 'arabic', 'french'].each do |lang|
			campaign["name_#{lang}"] = File.read("#{@base}challenges/#{campaign[:path]}/#{lang}/camp.info").split(",")[0].split(":")[1].strip
		end
	end
	current = Yajl.dump(campaigns)
	path = @base + "/statics/campaigns.json"
	original = File.read(path) rescue nil
	if original != current
		File.open(path, 'w') do |f|
			f.write(current)
		end
	end
end
