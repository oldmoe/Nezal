require 'reactor'
require 'tcp_server'
require 'http_connection'

module Orchestra 

  class Shehab
       
    def initialize(host, port)
      @options = {
        :host => host, 
        :port => port,
        :handler => Reactor::HTTPConnection,
      }
      @server = Reactor::TCPServer.new(@options)
    end  
    
    def reactor= (reactor)
      @options[:reactor] = reactor 
      @options[:socket] = @server.socket
      @server = Reactor::TCPServer.new(@options)
    end
        
    def start
      @server.start
    end
    
    def stop
      @server.stop
    end
    
  end
  
end
