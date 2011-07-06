module BD

  class Language

    class << self

      def load()
        game = Game::current
        data = {}
        if game.languages
          game.languages.each_key do |lang|
            data[lang] = LanguageManager.load_data(game.path, lang)
          end
        end
        data
      end

      def save(data)
        game = Game::current
        data = JSON.parse(data)
        if game.languages
          game.languages.each_key do |lang|
            LanguageManager.save_data(game.path, lang, data[lang])
          end
        end
      end

      def init()
        game = Game::current
        if game.languages
          game.languages.each_key do |lang|
            data = LanguageManager.load_data(game.path, lang)
            data['buildings'] ||= {}
            data['quests'] ||= {}
            game.buildings.keys.each do |key|
              data['buildings'][key] ||= { 'name' => '', 'desc' => '', 'upgrade_desc' => {} } 
            end
            BD::Quest::all().each_pair do |id, quest|
              data['quests'][id] ||= {}
              data['quests'][id]['conditionMsgs'] ||= {}
              if quest['conditions']['buildings']
                quest['conditions']['buildings'].each_pair do |building, hash|
                  data['quests'][id]['conditionMsgs'][building] ||= {}
                  hash.keys.each do |key|
                    data['quests'][id]['conditionMsgs'][building][key] = ''
                  end
                end
              end
              if quest['conditions']['resources']
                quest['conditions']['resources'].keys do |key|
                  data['quests'][id]['conditionMsgs'][key] = ''
                end
              end
            end
            LanguageManager.save_data(game.path, lang, data)
          end
        end
      end
  
    end

  end

end
