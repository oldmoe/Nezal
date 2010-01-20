class Court
  include Bdb::Persistable
  
  SEPARATOR = '-'
  
  def initialize(game_id, name, description)
    key = game_id + SEPARATOR + self.class.generate_key
    court =  { :key => key, :value => {:name => name, :description => description, :participants => []} }  
    @court = self.class.create(court)
  end
  
  def self.find(game_id)
    courts = []
    begin
      cursor = @@db_handler.cursor(nil, 0)
      result =  cursor.get(game_id, nil, Bdb::DB_SET_RANGE)
      puts result
      court = { :key=> result[0], :value => restore(result[1])} unless result.nil?
      if court[:key].index(game_id)==0
        courts << court
        result = cursor.get(court[:key], nil, Bdb::DB_NEXT) 
      end
      while result
        court = { :key=> result[0], :value => restore(result[1])} unless result.nil?
        if court[:key].index(game_id)==0
          courts << court 
          result = cursor.get(court[:key], nil, Bdb::DB_NEXT)
        else 
          break
        end
      end
    rescue Exception => e
      #TODO There should be some error handling in here we will see
      puts ">>>>>>>>>>> Exception in Court.find #{e.backtrace}"
      cursor.close
    end
    cursor.close
    courts
  end
  
end
