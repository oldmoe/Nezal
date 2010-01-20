require 'socket'
require 'neverblock'
require 'neverblock/core/system/timeout'

class NB::Connection

	CHUNK_SIZE = 1024 * 1024

	attr_reader :last_activity	
	attr_writer :server
	
	def initialize(conn, server)
		@conn = conn
		@server = server
		post_init
	end

	def post_init
	end

	def handle_request
		while !closed?
			::Timeout.timeout(@server.timeout) do
		    data = @conn.readpartial(CHUNK_SIZE)
			  receive_data(data)
			end
		end
	end
	
	def write data
		@conn.write data
	end

	def close
		@conn.close 
	end

	def closed?
		@conn.closed?
	end

	def receive_data(data)	
		write("HTTP/1.1 200 OK\r\nContent-Length: #{data.length}\r\nConnection: keep-alive\r\n\r\n#{data}")
	end

	def stream(io, offset = nil, length = nil)
		NB.defer(IO, :copy_stream, [io, self, offset, length])
	end

end
