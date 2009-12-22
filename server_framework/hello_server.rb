require 'reactor'
require 'socket'
require 'fcntl'

reactor = Reactor::Base.new

server = TCPServer.new("localhost", 8000)
server.listen(1024)
server.setsockopt(Socket::IPPROTO_TCP, Socket::TCP_NODELAY, 1)
server.setsockopt(Socket::IPPROTO_TCP, 9, 1) # TCP_DEFER_ACCEPT 
server.fcntl(Fcntl::F_SETFL, Fcntl::O_NONBLOCK)

BUFFER_SIZE = 128

$response = "HTTP/1.1 200 OK\r\nContent-Length: 6\r\nConnection: Keep-Alive\r\n\r\nHello!".freeze
$sep = "\r\n\r\n".freeze
reactor.attach(:read, server) do |server, reactor|
	conn = server.accept #_nonblock
	begin
		#conn.fcntl(Fcntl::F_SETFL, Fcntl::O_NONBLOCK)
		data = conn.gets($sep)
		conn.syswrite($response)
		if conn.eof?
			conn.close
		else 
			reactor.attach(:read, conn) do
				begin
					if conn.eof?
						conn.close
						reactor.detach(:read, conn)
					else
						data = conn.gets($sep)
						conn.syswrite($response)
						if conn.eof?
							conn.close
							reactor.detach(:read, conn)
						end
					end
				rescue Exception => e
					 conn.close unless conn.closed?
					 reactor.detach(:read, conn)
				end
			end
		end
	rescue Exception => e
		 conn.close unless conn.closed?
		 reactor.detach(:read, conn)
	end
end
fork
fork
fork
reactor.run
