require 'reactor'

module Orchestra

  class	Musician
	  include SignalTrapper
	  include Reactor		

	  def initialize(sockets, channel)
		  @sockets = sockets
		  @reactor = Base.new()
		  @monitor = channel
	  end

    def run 		
      trap_sigs
      @sockets.each { |socket|    
		    @reactor.attach(:read, socket[:socket]) do |socket, reactor|
			    begin
				    conn = socket.accept
				    handle_request(conn)
			    rescue Exception => e
				    puts ">>Exception"
				    conn.close
	     		end	
		    end
	    }
	    @reactor.add_periodical_timer(1) {
        begin
          result = @monitor.write_nonblock("1")
        rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR => e
          return
        rescue Errno::EPIPE => e
          exit!
        end
      }
      begin
  		  @reactor.run
		  rescue Exception => e
		    puts "Exception in run  #{e.message} #{e.backtrace}"
		  end
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
      @monitor.close
    end

    def trap_sigs
      [:TERM, :QUIT, :INT].each do |signal|
        trap(signal) do
          @reactor.next_tick do
            cleanup
            exit!
          end
        end
       end
    end
    
  end

end
