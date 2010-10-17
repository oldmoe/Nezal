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
	@game_name =  ENV['env'] == 'production' ? "defenderofarabia" : "local-city-defender"
end 
STDERR.puts "Generating campaign list for #{@game_name}"

def generate_campaigns
	game = Game.find_by_name(@game_name)
	campaigns = Campaign.select(:name, :path).where(:game_id => game.id).order(:created_at,:id).all.collect{|c|{name:c.name, path:c.path}}.reverse
	campaigns.shift
	current = Yajl.dump(campaigns)
	path = @base + "/statics/campaigns.json"
	original = File.read(path) rescue nil
	if original != current
		File.open(path, 'w') do |f|
			f.write(current)
		end
	end
end