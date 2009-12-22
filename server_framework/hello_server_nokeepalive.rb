require 'reactor'
require 'socket'
require 'fcntl'

reactor = Reactor::Base.new

server = TCPServer.new("localhost", 8000)
server.listen(100)
#server.setsockopt(Socket::IPPROTO_TCP, Socket::TCP_NODELAY, 1)
#server.setsockopt(Socket::IPPROTO_TCP, 9, 1) # TCP_DEFER_ACCEPT 
#server.fcntl(Fcntl::F_SETFL, Fcntl::O_NONBLOCK)

BUFFER_SIZE = 128

$response = "HTTP/1.1 200 OK\r\nContent-Length: 1\r\n\r\n!".freeze
$sep = "\r\n\r\n".freeze

$count = 0

reactor.attach(:read, server) do |server, reactor|
	begin
		10.times do
#			p "accepting"
			conn = server.accept_nonblock
			p $count += 1
			begin
#				p "reading"
				data = conn.gets($sep)
#				p "writing"
				conn.syswrite($response)
#				p "closing"
				conn.close
#				p "done"
			rescue Exception => e
				 conn.close unless conn.closed?
			end
		end
	rescue Exception => e
	end
end


reactor.run
