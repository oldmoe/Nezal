require 'reactor'
require 'socket'
require 'fcntl'

$count = ARGV[1].to_i
$concurrency = ARGV[0].to_i
$per_thread = ($count / $concurrency).ceil.to_i

# connect in a non blocking manner to the server
t = Time.now
fork
fork
$per_thread.times do
	socket = Socket.new(Socket::AF_INET, Socket::IPPROTO_TCP, 0)
	socket.connect_nonblock
	socket.write("ha?\r\n\r\n")
	socket.read(5)
	socket.close
end
puts Time.now - t

