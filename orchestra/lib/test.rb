require 'socket'
@socket = TCPServer.new('0.0.0.0', 8000)
def serve
	require 'neverblock'
	require './http_connection'
	require './tcp_server'
	server = NB::TCPServer.new({:socket => @socket, :reactor => NB.reactor, :handler => NB::HTTPConnection})
	loop { NB::Fiber.new { NB.reactor.run { server.start } }.resume }
end
0.times { serve unless fork }
serve
