require 'socket'
require 'orchestra'
require 'musician'

module Orchestra

  class Maestro
	  include Reactor
	  
    def initialize()
      # This is a hash of the workers.
      # Each worker entry has worker_pid as key and includes a hash of the following as value:
      #   :pipe : pipe of the worker process
      #   :inactive : an integer to indicate for how long worker pipe has been inactive
		  @workers = {}
		  # This is a hash containing each signal as the key and the following as value:
		  #   :proc : the procedure to invoke the next cycle when the signal is received
		  #   :received : an integer representing how many times the signal was received since last handled
      @sig_handlers = {}
      # This should include list of listen addresses
		  @servers = [{:address => "0.0.0.0", :port => "3000", :socket => nil }] 
		  # This should contain backlog size for sockets
		  @@backlog = 512 
		  # This should contain number of workers to maintain
		  @max_workers = 5
		  # Declare worker for recycle if it remains inactive for longer than timeout
		  @timeout = 10
		  @reactor = Base.new()
		  @reactor.set_timeout(1)
    end
    
    def run
      setup_servers
      @max_workers.times { new_worker }
      set_traps
      @reactor.add_periodical_timer(1) { calibrate_workers }
      @reactor.run  
      exit!
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
    
    # Clean up before exit
    def cleanup
      # close the sockets
      @servers.each { |server| server[:socket].close }
      reap_workers
      exit
    end
    
	  def set_traps
      [:TERM , :QUIT, :INT].each do |signal|
        @sig_handlers[signal] = { :proc => Proc.new do 
          # send shutdown signals to children
          @workers.each_key { |worker|  kill_worker(signal, worker) }
          cleanup
        end, :received => 0 }
      end
      @sig_handlers[:USR1] = { :proc => Proc.new do 
        @max_workers += 1
        new_worker
      end , :received => 0 }
      @sig_handlers[:USR2] = { :proc => Proc.new do 
        @max_workers -= 1
        kill_worker(:TERM, @workers.first[0]) unless @workers.first.nil?
      end , :received => 0 }
      @sig_handlers.each_key do |signal|
        trap(signal) { @sig_handlers[signal][:received] += 1 }
      end
	  end
	
    # This method does the following:
    #   Handles received signals
    #   Terminates inactive workers
    #   Reap dead workers
    #   Maintain the number of workers
    def calibrate_workers 
      # Handle received signals
      @sig_handlers.each_value do |signal| 
        signal[:received].times { signal[:proc].call }
        signal[:received] = 0
      end       
      # Check all channels for dead ones
      @workers.each_pair { |pid, worker|
        worker[:inactive] += 1
        if worker[:inactive] > @timeout
          kill_worker(:KILL, pid)
        end
      }
      reap_workers
      # Fork new_workers if needed
      while @workers.length < @max_workers
        new_worker
      end
#      @reactor.next_tick { calibrate_workers }
    end
    
    # Catch the dead workers and call reap_worker on them
    def reap_workers
      loop do 
        begin
          worker_pid, status =  Process.waitpid2(-1, Process::WNOHANG) 
        rescue Exception => e 
          return
        end
        return unless worker_pid
        reap_worker(worker_pid) 
      end
    end
    
    # Clean up a dead worker stuff
    def reap_worker(worker_pid)
      # Remove it from the hash of workers
      worker =  @workers.delete(worker_pid)
      if worker
        # Detach the pipe from the @reactor
        @reactor.detach(:read, worker[:pipe], true)
        # Close the pipe opened with the process
        worker[:pipe].close 
      end
    end
    
    # This should fork a child process .. 
    # Set up the pipe 
    # Close all unnessecary IO objects inherited from parent TODO
    def new_worker
      r_channel, w_channel = IO.pipe
	    worker_pid = Process.fork do
	      # Close all sockets inherited from parent
        @workers.each_value { |worker| worker[:pipe].close }
        @workers = nil
	      # Create a new musician 
	      r_channel.close
			  worker = Musician.new(@servers, w_channel)
		    worker.run 
			  exit
		  end
		  w_channel.close
      @workers[worker_pid] = { :pipe => r_channel, :inactive => 0 }
      @reactor.attach(:read, r_channel) do | pipe | 
        begin
          pipe.sysread(1)
          @workers[worker_pid][:inactive] = 0
        rescue  EOFError 
          @reactor.detach(:read, pipe)
          @workers[worker_pid][:inactive] = @timeout
        end
      end
    end
    
    def kill_worker(signal, worker_pid)
      Process.kill(signal, worker_pid) 
      reap_worker(worker_pid)
    end

  end
  
end

server = Orchestra::Maestro.new
server.run

