require 'neverblock'
require 'connection/http_connection'
require 'connection/rack_connection'
require 'server/tcp_server'

module Orchestra 

  class Shehab
    
    DEFAULTS = {  :rackup => "rackup.ru", 
                  :environment => "development",
                }
       
    def initialize(options)
      @options = {
        :host => options[:host], 
        :port => options[:port],
        :wdir  => ::File.join(options[:dir], "public"),
        :handler => NB::RackConnection,
      }

      @rackup = options[:rackup] || DEFAULTS[:rackup]
      @options[:app] = app().to_app
      @environment = options[:environment]  || DEFAULTS[:environment]
      @server = NB::TCPServer.new(@options)
    end      
           
    def start
      @server.start
    end
    
    def stop
      @server.stop
    end
    
    private

    def app()
      puts @rackup
      puts DEFAULTS[:rackup]
      app = case @rackup
      when /\.rb$/
        Kernel.load(@rackup)
        Object.const_get(File.basename(@rackup, '.rb').capitalize.to_sym)
      when /\.ru$/
        begin 
          rackup_code = File.read(@rackup)
          eval("Rack::Builder.new {( #{rackup_code}\n )}", TOPLEVEL_BINDING, @rackup)
        rescue Errno::ENOENT 
        end
      end
      app ||= guess_app
      return app
    end
    
    # For now this only supports rails   
    def guess_app
      app = if ::File.exists?(::File.join(::File.dirname(@options[:wdir]), "config/environment.rb"))
              require 'config/environment'
              Rack::Builder.new do
                use Rails::Rack::Static
                run ActionController::Dispatcher.new
              end
            else
              raise Exception, "No rackup file nore rails environement file found. Please supply one of them"
            end
    end
    
  end
  
end
