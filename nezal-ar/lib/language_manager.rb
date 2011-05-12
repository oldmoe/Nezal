class LanguageManager
  
  def self.load_data(game_name, language)
    generate_language_file(game_name, language)
    file_path = File.join(self.path(game_name), language+'.html')
    content = JSON.parse(File.read(file_path))
    content
  end

  def self.save_data(game_name, language, data)
    generate_language_file(game_name, language)
    file_path = File.join(self.path(game_name), language+'.html')
    file = File.new(file_path, 'w')      
    file.write(JSON.generate(data))
    file.close
  end

  def self.generate_language_file(game_name, language)
    language_dir = path(game_name)
    file_name = File.join( language_dir, language+'.html')
    if (!File.exists?(file_name))
      file = File.new(file_name, 'w')      
      file.write(JSON.generate({}))
      file.close
    end
  end

  def self.path(game_name)
    return File.join(Dir.pwd, "public", game_name, "statics")
  end

end
