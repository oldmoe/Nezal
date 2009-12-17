require 'socket'
require 'orchestra'
require 'musician'


module Orchestra

  class Maestro 
    include SignalTrapper

    def initialize()
		  @workers = {} # This should include the workers by their pids
		  @servers = [{:address => "0.0.0.0", :port => "3000", :socket => nil  }] # This should include list of listen addresses
		  @channels = {}
		  @@backlog = 512 # This should contain backlog size for sockets
		  @max_workers = 5
    end
    
    def run 
      setup_servers 
      trap_sigs
      @max_workers.times do 
        new_worker
      end
      while true do 
        begin
          sleep 0.1
        rescue Exception => e
          exit!
        end
        #Process.waitpid2(-1, Process::WNOHANG)
      end 
    end
    
    # Clean up before exit
    def cleanup
      # close the sockets 
      @servers.each{ |server|
        server[:socket].close
      }
      exit
    end
    
    private
    
	  def	load_config
	  end
	
	  def setup_servers 
	    @servers.each { | server |
	      socket = TCPServer.new(server[:address], server[:port])
	      socket.listen(@@backlog)
	      server[:socket] = socket
	    }
	  end
	
	  def trap_sigs
      set_traps [:TERM , :QUIT, :INT] { |signal|
        # send shutdown signals to children
        @workers.each_key { |worker_pid|
          kill_worker(signal, worker_pid)
        }
        cleanup
      }
      set_traps [:USR1] { 
        new_worker
      }
      set_traps [:USR2] { 
        kill_worker(:TERM, @workers.first[0]) unless @workers.first.nil?
      }
      set_traps [:CHLD] { 
        new_worker
      }
	  end  
    
    # Here the maestro should check on all of the workers
    # Terminate a non-responding one and fork another instead
    def calibrate_workers 
    end
    
    # This should fork a child process .. 
    # Set up the pipe 
    # Close all unnessecary IO objects inherited from parent TODO
    def new_worker
      r_channel, w_channel = IO.pipe
	    worker_pid = Process.fork { 
	      r_channel.close
			  worker = Musician.new(@servers, w_channel)
			  worker.run
			  exit	
		  }
		  w_channel.close
      @workers[worker_pid] = r_channel
    end
    
    def kill_worker(signal, worker_pid)
      worker =  @workers.delete(worker_pid)
      Process.kill(signal, worker_pid) rescue puts "Exception ........ #{worker_pid}"
      # Close the pipe opened with the process
      worker.close
    end

  end
  
end

#server = Orchestra::Maestro.new
#server.run

