require 'reactor'

module Orchestra

  class	Musician
	  include SignalTrapper
	  include Reactor		

	  def initialize(sockets, channel)
		  @sockets=sockets
		  @reactor=Base.new()
		  @monitor=channel
	  end

    def run 		
      trap_sigs
      @sockets.each { |socket|    
		    @reactor.attach(:read, socket[:socket]) do |socket, reactor|
			    begin
				    conn = server.accept
				    handle_request(conn)
			    rescue Exception => e
				    puts ">>Exception"
				    conn.close
	     		end	
		    end
	    }
		  @reactor.run
	  end
   
    private
    def handle_request(conn)
	    conn.gets()
	    conn.write("HTTP/1.1 200 OK\r\n\r\nHello World!\r\n")
	    conn.close
    end

    # Clean up before exit
    def cleanup   
      # close the sockets 
      @sockets.each{ |server|
        server[:socket].close
      }
    end

    def trap_sigs
      set_traps([:TERM , :QUIT, :INT]) { |signal|
        cleanup
        exit!
      }
    end
    
  end

end
