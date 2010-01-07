require 'ipaddr'
module Orchestra
  
  class Configurator
    
    attr_reader :configs
    
    DEFAULTS = {
  	  :servers => [{:host => "0.0.0.0", :port => 9000}], 
  	  # This should contain number of workers to maintain
  	  :workers => 1,
  	  # Declare worker for recycle if it remains inactive for longer than timeout
  	  :timeout => 60, 
  	  :pre_fork => nil,
  	  :post_fork => nil
    }
    
    ERROR_MSGS = {
      :worker => "Workers number is not an integer",
      :timeout => "Timeout is not a number",
      :socket => "Socket path not found",
      :file => "Config file not found",
      :port => "Invalid port",
      :host => "Invalid host"
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
      puts @configs
      DEFAULTS.each do |key, value|
        puts key, @configs.key?(key)
        @configs[key] = value unless @configs.key?(key)
      end
    end
    
    def server(address)
      @configs[:servers] = [] unless @configs[:servers]
      if Integer === address 
        @configs[:servers] << { :host => "0.0.0.0", :port => address } 
      elsif File.exists?(File.dirname(File.expand_path(address))) 
        @configs[:servers] << { :host => address }
      else
        raise ArgumentError, ERROR_MSGS[:server]
      end
    end
    
    def listen(options)
      @configs[:servers] = [] unless @configs[:servers]
      server = {}
      server[:dir] = options[:dir]
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
    
    def config_file(file)
      @config_file = file
    end
    
    def [](key) # :nodoc:
      @configs[key]
    end
    
  end
  
end

