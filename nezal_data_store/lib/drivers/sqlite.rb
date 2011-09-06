require 'sqlite3'

module DataStore
  module Driver
    module SQLite

      class DB < GenericDriver
	
        SEP = "[:]".freeze

        attr_accessor :store_name
      
        def initialize(store_name)
          @store_name = store_name
          @@conn ||= ::SQLite3::Database.new('./db/sqlite3.db')
          #@@conn.synchronous = 0
          create_store
        end

        def create_store
          @@conn.execute("create table #{store_name}(key string PRIMARY KEY, value string)") rescue nil
        end
        
        def get(key)
          result = @@conn.execute("select * from #{store_name} where key='#{key.to_s}'").first
        end

        def save(key, value)
          @@conn.execute("insert or replace into #{store_name} values('#{key.to_s}', ?)", value)
        end

        def delete(key)
          @@conn.execute("delete from #{store_name} where key='#{key.to_s}'")
        end

      end

      class InvertedIndex < DB
        
        def initialize(db_name, index_name)
          @store_name = "#{index_name}_#{db_name}"
          create_store
       end

      end

      class Index < DB

        alias basic_delete delete

        def initialize(db_name, index_name)
          @store_name = "#{db_name}_#{index_name}"
          @inverted_index = InvertedIndex.new(db_name, index_name)
          create_store
        end

        def save(score, member)
          member = member.to_s
          old_score = @inverted_index.get(member)
          @inverted_index.save(member, score)
          if old_score
            basic_delete(key(old_score[1], member))    
          end
          super(key(score, member), nil)
        end

        def delete(member)
          member = member.to_s
          old_score = @inverted_index.get(member)
          @inverted_index.delete(member)
          super(key(old_score, member))
        end
 
        def after(score, member, count=1)
          result = @@conn.execute("select key from #{store_name} where key > '#{key(score, member)}' order by key asc limit #{count}").collect do |r|
                                    r[0].split(SEP).last if r && r[0]
                                  end
        end

        def before(score, member, count=1)
          result = @@conn.execute("select key from #{store_name} where key < '#{key(score, member)}' order by key desc limit #{count}").collect do |r| 
                                    r[0].split(SEP).last if r && r[0]
                                  end
        end

        def first(count=1)
          result = @@conn.execute("select key from #{store_name} order by key limit #{count}").collect do |r|
                                    r[0].split(SEP).last if r && r[0]
                                  end
          result
        end

        def last(count=1)
          result = @@conn.execute("select key from #{store_name} order by key desc limit #{count}").collect do |r| 
                                    r[0].split(SEP).last if r && r[0]
                                  end
        end


        def key(score, member)
          "#{format(score)}#{SEP}#{member}"
        end

      end

    end # SQLite
  end
end


