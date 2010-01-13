require 'ipaddr'
require 'etc'
require 'rack'

module Orchestra
  
  class Configurator
    
    attr_reader :configs
    
    DEFAULTS = {
  	  :servers    =>  [{:host => "0.0.0.0", :port => 9000, :dir => Dir.pwd}], 
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
      DEFAULTS.each do |key, value|
        @configs[key] = value unless @configs.key?(key)
      end
      @configs[:app] = app
    end
    
    def listen(options)
      @configs[:servers] = [] unless @configs[:servers]
      server = {}
      puts options
      server[:dir] = if options[:dir] 
                       File.exists?(options[:dir])? options[:dir] : (raise ArgumentError, ERROR_MSGS[:dir])
                     end
      if options[:socket] 
        File.exists?(File.dirname(File.expand_path(options[:socket])))? 
            server[:socket] = options[:socket] : (raise ArgumentError, ERROR_MSGS[:socket])
        @configs[:servers] << server
        return
      end 
      server[:port] = if options[:port]
                        (Integer === options[:port] && options[:port] > 0)? options[:port] : (raise ArgumentError, ERROR_MSGS[:port])
                      else
                        DEFAULTS[:servers].first[:port]
                      end
      server[:host] = if options[:host]
                        IPAddr.new(options[:host]) rescue ArgumentError (raise ArgumentError, ERROR_MSGS[:host])
                        options[:host]
                      else
                        DEFAULTS[:servers].first[:host]
                      end
      @configs[:servers] << server  
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
    
    def app()
      require 'config/boot'
      require 'config/environment'
      Rack::Builder.new do
        use Rails::Rack::Static
        run ActionController::Dispatcher.new
      end.to_app
    end
    
    def [](key) # :nodoc:
      @configs[key]
    end
    
  end
  
end

