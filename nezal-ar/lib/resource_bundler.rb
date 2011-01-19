require 'sprockets'
require 'erb'
require 'base64'
require 'net/http'
require 'uri'

load Dir.pwd + '/lib/jsmin.rb'



@base = Dir.pwd + "/public/tunisia-defender/"

@files = {
	'base' => [
		"prototype.js",
		"effects.js",
		"soundmanager2-nodebug-jsmin.js",
		"template.js"
	],

	'game' => [
		"fb_defender.js",
		"configs/creep_config.js",
		"configs/tower_config.js",
		"configs/super_weapon_config.js",
		"configs/upgrade_config.js",
		"intro/challenge_selector.js",
		"languages/arabic.js",
		"intro/intro.js",
		"baloon.js",
		"sounds.js",
		"loader.js",
		"healthSprite.js",
		"composite_unit_sprite.js",
		"city_defender_scene.js",
		"display_scene.js",
		"tutorial_scene.js",
		"mapeasy1.js",
		"config.js",
		"game.js",
		"unit.js",
		"creep.js",
		"bullets.js",
		"rockets.js",
		"ghost_turret.js",
		"tanks.js",
		"displays.js",
		"plane.js",
		"animation.js",
		"super_weapon.js",
		"upgrade.js",
		"tutorial.js",
		"scenario.js",
		"range_sprite.js",
		"incoming_waves.js"
	],
	
	'intro' => [
		'intro.css',
		'creeps-carousel.css',
		'market-carousel.css'
	]
}

def bundle
	total = ''
  @base = Dir.pwd + "/public/tunisia-defender/"
	[['base','js'], ['nezal','js'], ['game', 'js'], ['intro', 'css'],['payments', 'js'],['payments', 'css']].each do |folder|
		STDERR.print "Processing #{folder.join('.')} ... "
		if folder[0] != 'nezal' && folder[0] != 'payments'
			file = Sprockets::Secretary.new(
				:source_files => @files[folder[0]].collect{|name| "#{@base}#{folder[1]}/#{folder[0]}/#{name}"}
			)
		else
			file = Sprockets::Secretary.new(
				:source_files => ["#{@base}#{folder[1]}/#{folder[0]}/*.#{folder[1]}"]
			)
		end
		conc = file.concatenation
		if folder[1] == 'js'
			data_out = StringIO.new
			data_in = StringIO.new(conc.to_s)
			jsmin(data_in, data_out)
			data_out.rewind
			data_out = data_out.read
			total<<";"<<data_out if folder[0]!='base'
		else
			data_out = conc.to_s
	end
		original = File.read("#{@base}#{folder[1]}/all/#{folder[0]}.#{folder[1]}") rescue nil
		if original == data_out
			STDERR.puts " no changes found, skipping file"
		else
			File.open("#{@base}#{folder[1]}/all/#{folder[0]}.#{folder[1]}", "w") do |file|
				file.write(data_out)
			end	
			STDERR.puts " DONE"
		end
	end
=begin
	response = Net::HTTP.post_form(URI.parse('http://closure-compiler.appspot.com/compile'), {
	'js_code' => total,
	'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
	'output_format' => 'text',
	'output_info' => 'compiled_code'
	})	 
	File.open("#{@base}js/all/all.js", "w") do |file|
				file.write(response.body)
	end
=end
end
def bust_cache(path)
	buster = File.mtime("#{@base}#{path}").to_i.to_s(36)
	"#{path}?t=#{buster}"
end

def render
	STDERR.print "Processing game.html ... "
	template = ERB.new(File.read(Dir.pwd + '/app/views/games/tunisia-defender/index.erb'))
	result = template.result(binding)
	File.open("#{@base}index.html", "w") do |file|
		file.write(result)
	end
	STDERR.puts " DONE"
end

def generateImageHTMLFile resourceDir,fileToWrite,id
		Dir.entries(resourceDir).each do |filename|
			unless ['.', '..'].include? filename
				if filename.include? '.png'
					file = File.open("#{resourceDir}/#{filename}", 'rb')
					data = Base64.strict_encode64(file.read)
					#file.close
					image_id = "images#"+id +"#"+filename
					["animations", "intro", "challenges"].each do |folder|
						if resourceDir.include? folder
							found = false
							dirs = []
							resourceDir.split('/').each do |dir|
								if folder == "intro"
									found = true if dir == "images"
								else
									found = true if dir == folder
								end
								dirs << dir if found
							end
							dirs << filename
							image_id = dirs.join('/')
							image_id.sub!('/', '#').sub!('/', '#')							
						end					
					end
					fileToWrite.puts "['#{image_id}', 'data:image/png;base64,#{data}'],"
					#fileToWrite.puts "<img id='#{image_id}' src='data:image/png;base64,#{data}'/>"
				elsif File.directory? "#{resourceDir}/#{filename}"
					generateImageHTMLFile "#{resourceDir}/#{filename}",fileToWrite,id
				end
			end			
		end
end

def generateDumbImageHTMLFile resourceDir,fileToWrite,id
	Dir.entries(resourceDir).each do |filename|
		unless ['.', '..'].include? filename
			if filename.include? '.png'
				image_id = "images#"+id +"#"+filename
				["animations", "intro", "challenges"].each do |folder|
					if resourceDir.include? folder
						found = false
						dirs = []
						resourceDir.split('/').each do |dir|
							if folder == "intro"
								found = true if dir == "images"
							else
								found = true if dir == folder
							end
							dirs << dir if found
						end
						dirs << filename
						image_id = dirs.join('/')
						image_id.sub!('/', '#').sub!('/', '#')							
					end					
				end
				src = "../#{(resourceDir.include?"animations")? 'images/' : ''}#{image_id.gsub('#','/')}"
				fileToWrite.puts "<img id='#{image_id}'  src='#{src}' />"
			elsif File.directory? "#{resourceDir}/#{filename}"
				generateDumbImageHTMLFile "#{resourceDir}/#{filename}",fileToWrite,id
			end
		end			
	end
end

def generateSoundHTMLFile resourceDir,fileToWrite,type
		Dir.entries(resourceDir).each do |filename|
			unless ['.', '..'].include? filename
					unless File.directory? "#{resourceDir}/#{filename}"
					file = File.open("#{resourceDir}/#{filename}", 'rb')
					data = Base64.strict_encode64(file.read)
					file.close
					fileToWrite.puts "<audio id='sounds#game##{filename}' src='data:audio/#{type};base64,#{data}'></audio>"
					end
			end			
		end
end

def generate_resources 
	Dir.mkdir "#{@base}html_resources" if !(File.directory? "#{@base}html_resources")
	resourcesDirs = Dir.entries("#{@base}images")
	resourcesDirs.each do |resourceDir|
		unless ['.', '..'].include? resourceDir
			if File.directory? "#{@base}images/#{resourceDir}"
				wrap("#{@base}html_resources/#{resourceDir}.html") do |images|
					generateImageHTMLFile("#{@base}images/#{resourceDir}",images,resourceDir)
				end				
				wrap_dumb("#{@base}html_resources/#{resourceDir}_dumb.html") do |images|
					generateDumbImageHTMLFile("#{@base}images/#{resourceDir}",images,resourceDir)
				end
			end
		end
	end

	
	Dir.entries("#{@base}challenges").each do |challenge|
		unless ['.', '..'].include? challenge
			wrap("#{@base}html_resources/#{challenge}.html") do |challenges|
				generateImageHTMLFile "#{@base}challenges/"+challenge,challenges,"challenges"
			end
			wrap_dumb("#{@base}html_resources/#{challenge}_dumb.html") do |challenges|
				generateDumbImageHTMLFile "#{@base}challenges/"+challenge,challenges,"challenges"
			end
		end
	end
	

	wrap("#{@base}html_resources/mp3.html") do |file|
		generateSoundHTMLFile "#{@base}sounds/sfx/mp3", file,"mpeg"
	end	
	wrap("#{@base}html_resources/ogg.html") do |file|
		generateSoundHTMLFile "#{@base}sounds/sfx/ogg", file,"ogg"
	end	
end

def wrap(path)
	STDERR.print "Processing #{path.split('/').last} ... "
	file = StringIO.new
	file.puts("<html><body><div id='resources'><script>var resources = [")
	yield file
	file.puts("null];parent.register(window, resources)</script></div></body></html>")
	file.rewind
	data = file.read
	original = File.read(path) rescue nil
	if original == data
		STDERR.puts " no changes found, skipping file"
	else
		File.open(path, 'w') do |f|
			f.write(data)
		end
		STDERR.puts " DONE"
	end
end

def wrap_dumb(path)
	STDERR.print "Processing #{path.split('/').last} ... "
	file = StringIO.new
	file.puts("<html><head><script src='../js/base/prototype.js'></script></head><body><div id='resources'>")
	yield file
	file.puts("</div><script>document.observe('dom:loaded', function() { window.parent.register(window, $('resources').childElements(), true) });</script></body></html>")
	file.rewind
	data = file.read
	original = File.read(path) rescue nil
	if original == data
		STDERR.puts " no changes found, skipping file"
	else
		File.open(path, 'w') do |f|
			f.write(data)
		end
		STDERR.puts " DONE"
	end
end


