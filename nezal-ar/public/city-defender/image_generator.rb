require 'base64'

def generateImageHTMLFile resourceDir,fileToWrite,id
		Dir.entries(resourceDir).each do |filename|
			unless ['.', '..'].include? filename
				if filename.include? '.png'
					file = File.open("#{resourceDir}/#{filename}", 'rb')
					data = Base64.strict_encode64(file.read)
					file.close
					image_id = "images/"+id +"/"+filename
					image_id = "#{resourceDir[7,resourceDir.length]}/#{filename}" if(resourceDir.include? "animations")
					fileToWrite.puts "<img id='#{image_id}' src='data:image/png;base64,#{data}'/>"
				elsif File.directory? "#{resourceDir}/#{filename}"
						generateImageHTMLFile "#{resourceDir}/#{filename}",fileToWrite,id
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
					fileToWrite.puts "<audio id='#{filename}' src='data:audio/#{type};base64,#{data}'/>"
					end
			end			
		end
end

def generateResources 
	resourcesDirs = Dir.entries('images')
	resourcesDirs.each do |resourceDir|
		unless ['.', '..'].include? resourceDir
			if File.directory? "images/#{resourceDir}"
				wrap("html_resources/#{resourceDir}.html") do |images|
					generateImageHTMLFile("images/#{resourceDir}",images,resourceDir)
				end				
			end
		end
	end

	wrap("html_resources/challenges.html") do |challenges|
		generateImageHTMLFile "challenges",challenges,"challenges"
	end	

	wrap("html_resources/mp3.html") do |file|
		generateSoundHTMLFile "sounds/sfx/mp3", file,"mpeg"
	end	
	wrap("html_resources/ogg.html") do |file|
		generateSoundHTMLFile "sounds/sfx/ogg", file,"ogg"
	end	
end

def wrap(path)
	begin
		script = "<script>parent.register(this)</script>"
		file = File.open(path, 'w')
		file.puts("<html><body><div id='resources'>")
		yield file
		file.puts("</div></body></html>")
		file.puts(script)
	ensure
		file.close
	end
end


generateResources()

