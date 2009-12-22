require 'fcntl'
require 'socket'
require 'reactor'
require 'tcp_handler'

class Reactor::TCPServer

	@@count = 0
	attr_accessor :reactor

	TCP_DEFER_ACCEPT = 9

	def initialize(host, port, handler_class, reactor = Thread.current[:reactor])
		@socket = ::TCPServer.new(host, port)
		@socket.listen(511)
		@socket.setsockopt(Socket::IPPROTO_TCP, Socket::TCP_NODELAY, 1)
		@socket.setsockopt(Socket::IPPROTO_TCP, TCP_DEFER_ACCEPT , 1) 
		@socket.fcntl(Fcntl::F_SETFL, Fcntl::O_NONBLOCK)		
		@reactor = reactor
		@handler_class = handler_class
	end

	def start
		@reactor.attach(:read, @socket) do |socket, reactor|
			begin
				loop do
					conn = socket.accept #_nonblock					 
					p @@count += 1
					begin
						request_handler = @handler_class.new(conn, reactor)
					rescue Exception => e
						puts e # we need to log those errors, may be are being DDoSed?
						puts e.backtrace		
						request_handler.close(false)	# close the request now 
					end
				end
			rescue Exception => e
			end
		end
		@reactor.run
	end

	def stop
		@reactor.detach(:read, @socket)
	end
end

if __FILE__ == $0

	class MyHandler < Reactor::TCPHandler
		@@count = 0
		def data_received(data)
			p @@count += 1
			write("HTTP/1.1 200 OK\r\nContent-Length: 6\r\n\r\nHello!")
			close
		end
	end

	server = Reactor::TCPServer.new("localhost", 8000, MyHandler, Reactor::Base.new)
	server.start

end
