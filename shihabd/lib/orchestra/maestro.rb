require 'orchestra/musician'
require 'orchestra/configurator'
require 'logger'

module Orchestra

  class Maestro
    include Configurator
    
    attr_accessor :configs
 	  	  
    def initialize(options={})
      # Hash to be filled using Configurator
      @configs = {}
      # Create an options hash with the passed arguements and default options for 
      # the ones not passed
      @options = {}
      # This should include list of listen addresses
      @servers = {}
      # Hash of the workers. Each entry has key: worker_pid, a hash of the following as value:
      #   :pipe : pipe of the worker process
      #   :inactive : an integer to indicate for how long worker pipe has been inactive
      @workers = {}
      # This is a hash containing each signal as the key and the following as value:
      #   The procedure to invoke the next cycle when the signal is received
      @sig_handlers = {}
      # This is an array containing signals received
      @sig_queue = []
      @reactor = Reactor::Base.new()
      options.each_pair { |key, value| send key, value }
    end

    def run
      @options = @configs.dup
      DEFAULTS.each_pair { |key, value| @options[key] = value unless @options[key]}
      @servers = @options[:servers] || [DEFAULTS[:server]]
      setup_servers
      @options[:workers].times { new_worker }
      set_traps
      @reactor.add_periodical_timer(1) { calibrate_workers }
      @reactor.run  
      exit!
    end

    private
	  
    def setup_servers
      @servers.each do |server|
        listner = server[:class].new(server)
        server[:listner] = listner
      end
    end
    
    # Clean up before exit
    def cleanup
      reap_workers
      exit
    end
    
    # Set the master process signal traps
    #   USR1 : increase number of workers
    #   USR2 : decrease number of workers
    #   TERM, QUIT, INT : kill workers and cleanup
    def set_traps
      [:TERM , :QUIT, :INT].each do |signal|
        @sig_handlers[signal] = Proc.new do 
          # send shutdown signals to children
          @workers.each_key { |worker|  kill_worker(signal, worker) }
          cleanup
        end
      end
      @sig_handlers[:USR1] = Proc.new do 
        @options[:workers] += 1
        new_worker
      end
      @sig_handlers[:USR2] = Proc.new do 
        @options[:workers] -= 1
        kill_worker(:TERM, @workers.first[0]) unless @workers.first.nil?
      end
      @sig_handlers.each_key do |signal|
        trap(signal) { @sig_queue << signal }
      end
    end
	
    # This method does the following:
    #   Handles received signals
    #   Terminates inactive workers
    #   Reap dead workers
    #   Maintain the number of workers
    def calibrate_workers 
      # Handle received signals
      @sig_queue.each { |signal| @sig_handlers[signal].call }
      @sig_queue = []
      # Check all channels for dead ones
      @workers.each_pair { |pid, worker|
        worker[:inactive] += 1
        if worker[:inactive] > @options[:timeout]
          puts "killing worker #{pid} #{worker[:inactive]}"
          kill_worker(:KILL, pid)
        end
      }
      reap_workers
      # Fork new_workers if needed
      while @workers.length < @options[:workers]
        new_worker
      end
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
    # Close all unnessecary IO objects inherited from parent
    def new_worker
      r_channel, w_channel = IO.pipe     
      worker_pid = Process.fork do
        Process.egid= @options[:group]
        Process.euid= @options[:user]
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
          @workers[worker_pid][:inactive] = @options[:timeout]
        end
      end
    end
    
    def kill_worker(signal, worker_pid)
      Process.kill(signal, worker_pid) 
      reap_worker(worker_pid)
    end

  end
  
end

if __FILE__ == $0
  trap('INT') do 
    puts "Exiting"
    exit
  end  
  server = Orchestra::Maestro.new
  server.run
end
