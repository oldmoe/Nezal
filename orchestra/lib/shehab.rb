require 'neverblock'
require './http_connection'
require './tcp_server'

module Orchestra 

  class Shehab
       
    def initialize(host, port)
      @options = {
        :host => host, 
        :port => port,
        :handler => NB::HTTPConnection
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
