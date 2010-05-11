require 'reactor'
require 'neverblock'
require 'logger'

module Orchestra

  class	Musician

    def initialize(sockets, channel, logger)
      @servers = sockets
      @monitor = channel
      @reactor = NB.reactor
      NB.initThreads
      @logger = logger
      @name   = "Shihabd #{Process.pid}"
    end

    def run 		
      trap_sigs
      @logger.log(Logger::Severity::INFO, "Started .. Running with PID : #{Process.pid}", @name)
      @reactor.add_periodical_timer(1) do
        begin
          result = @monitor.syswrite("1")
        rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR => e
          return
        rescue Errno::EPIPE => e
          @logger.log(Logger::Severity::ERROR, "Channel with master broken .. exiting", @name)
          exit!
        end
      end
      @servers.each { |server| 
        server[:listner].start 
      }    
      begin
        loop { 
          NB::Fiber.new{ @reactor.run }.resume 
        }
      rescue Exception => e
        @logger.log(Logger::Severity::ERROR, "Exception in run : #{e.backtrace}", nil)
      end
    end
   
    private

    # Clean up before exit
    def cleanup   
      # close the sockets 
      @servers.each{ |server| server[:listner].stop }
      @monitor.close
    end

    def trap_sigs
      [:TERM, :QUIT, :INT].each do |signal|
        trap(signal) do
          @reactor.next_tick do
            cleanup
            @logger.log(Logger::Severity::INFO, "Received termination signal .. Shutting down", @name)
            exit!
          end
        end
       end
    end
    
  end

end
