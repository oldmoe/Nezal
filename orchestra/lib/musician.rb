require 'reactor'
require 'neverblock'

module Orchestra

  class	Musician

	  def initialize(sockets, channel)
		  @servers = sockets
		  @monitor = channel
		  @reactor = NB.reactor
	  end

    def run 		
      trap_sigs
	    @reactor.add_periodical_timer(1){
        begin
          puts "hi"
          result = @monitor.write_nonblock("1")
          puts "hi back"
        rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR => e
          puts "error"
          return
        rescue Errno::EPIPE => e
          puts "broken error"
          exit!
        end
      }
      @servers.each { |server|
        server[:listner].start
      }    
      begin
		  	loop { NB::Fiber.new { @reactor.run }.resume }
		  rescue Exception => e
		    puts "Exception in run  #{e.message} #{e.backtrace}"
		  end
	  end
   
    private

    # Clean up before exit
    def cleanup   
      # close the sockets 
      @servers.each{ |server|
        server[:listner].stop
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
