require 'neverblock'
require 'http_connection'
require 'tcp_server'

module Orchestra 

  class Shehab
       
    def initialize(host, port, app)
      @options = {
        :host => host, 
        :port => port,
        :handler => NB::HTTPConnection, 
        :app  => app
      }
      @server = NB::TCPServer.new(@options)
    end  
           
    def start
      @server.start
    end
    
    def stop
      @server.stop
    end
    
  end
  
end
