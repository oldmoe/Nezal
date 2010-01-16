require 'ipaddr'
require 'etc'
require 'rack'

require 'orchestra/shehab'

module Orchestra
  
  module Configurator
    
    attr_reader :configs
    
    DEFAULTS = {
  	  :server     =>  {:host => "0.0.0.0", :port => 9000, :dir => Dir.pwd, :class => Orchestra::Shehab,  :rackup => "config.ru"}, 
  	  # This should contain number of workers to maintain
  	  :workers    =>  1,
  	  # Declare worker for recycle if it remains inactive for longer than timeout
  	  :timeout    =>  10, 
  	  :pre_fork   =>  nil,
  	  :post_fork  =>  nil, 
  	  :daemonize  =>  false,
      :pid_file   =>  "tmp/pids/shehab.pid",
      :user       =>  0,
      :group      =>  0
    }
    
    ERROR_MSGS = {
      :worker   =>  "Workers number is not an integer",
      :timeout  =>  "Timeout is not a number",
      :socket   =>  "Socket path not found",
      :file     =>  "Config file not found",
      :port     =>  "Invalid port",
      :host     =>  "Invalid host",
      :dir      =>  "Directory doesn't exist",
      :user     =>  "User doesn't exist in system",
      :pid_file =>  "Directory for the pid file not found",
      :rackup   =>  "Rackup file not found",
    }
    
    def initialize ()
      @configs = {}      
    end
    
    def load_config(config_file)
      if config_file 
        begin
          instance_eval(File.read(config_file))
        rescue ArgumentError => e
          raise ArgumentError, e.message
        rescue Errno::ENOENT
          raise ArgumentError, ERROR_MSGS[:file]
        end
      end
    end
    
    def listen(options, default=false)
      @configs[:servers] = [] unless @configs[:servers]
      server = DEFAULTS[:server].dup
      server[:dir] = File.exists?(options[:dir])? options[:dir] : (raise ArgumentError, ERROR_MSGS[:dir]) if options[:dir] 
      server[:rackup] = File.exists?(options[:rackup])? options[:rackup] : (raise ArgumentError, ERROR_MSGS[:rackup]) if options[:rackup] 
      if options[:socket] 
        File.exists?(File.dirname(File.expand_path(options[:socket])))? 
            server[:socket] = options[:socket] : (raise ArgumentError, ERROR_MSGS[:socket])
        @configs[:servers] << server
        return
      end 
      if options[:port]
        server[:port] = (Integer === options[:port] && options[:port] > 0)? options[:port] : (raise ArgumentError, ERROR_MSGS[:port])
      end
      server[:host] = if options[:host]
                        IPAddr.new(options[:host]) rescue ArgumentError (raise ArgumentError, ERROR_MSGS[:host])
                        options[:host]
                      else 
                        server[:host]
                      end
      if default
        DEFAULTS[:server] = server
      else
        @configs[:servers] << server  
      end
    end
    
    def workers(number)
      (Integer === number)? @configs[:workers] = number : (raise ArgumentError, ERROR_MSGS[:worker])
    end
    
    def timeout(seconds)
      (Numeric === seconds)? @configs[:timeout] = seconds : (raise ArgumentError, ERROR_MSGS[:timeout])
    end
    
    def pre_fork(&block)
      @configs[:pre_fork] = block
    end
    
    def post_fork(&block)
      @configs[:post_fork] = block
    end
    
    def user(user)
      (String === user)? 
          @configs[:user] = Etc::getpwnam(user).uid rescue ( raise ArguementError, ERROR_MSGS[:user] ) : ( raise ArguementError, ERROR_MSGS[:user] )
    end
    
    def group(group)
      (String === group)? 
          @configs[:group] = Etc::getgrnam(group).gid rescue ( raise ArguementError, ERROR_MSGS[:group] ) : ( raise ArguementError, ERROR_MSGS[:group] )
    end
    
    def pid_file(pid)
      File.exists?(File.dirname(File.expand_path(pid)))? 
        server[:pid_file] = pid : (raise ArgumentError, ERROR_MSGS[:pid_file])
    end
    
    def daemonize(daemonize)
      @configs[:daemonize] = daemonize
    end
    
    def config_file(file)
      @config_file = file
    end
    
    def rackup(file)
      File.exists?(file)? @configs[rackup] = file : (raise ArguementError, ERROR_MSGS[:rackup])
    end
    
    def [](key) # :nodoc:
      @configs[key]
    end
    
  end
  
end

