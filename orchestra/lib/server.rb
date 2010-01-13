require 'fcntl'
require 'socket'
require 'reactor'
require 'time'
require 'lruhash'

class NB::Server

	include Socket::Constants

	TCP_DEFER_ACCEPT = 9
	TCP_CORK = 3
	CONNECTION_TIMEOUT = 120 # 2 minutes default timeout
	
	attr_reader :connections, :timeout, :wdir, :app, :file_cache
	
	def initialize(options)
		@file_cache = LRUHash.new
		@started = false
		@connections = {}
		@reactor = NB.reactor
		@app = options[:app]
		@timeout = (options[:timeout] || CONNECTION_TIMEOUT) # timeout in milliseconds (not really used yet)
		@wdir = options[:wdir] || Dir.getwd + '/public' # set the working directory to the process' working directory by default
		@handler = options[:handler] || NB::Connection	
		@app = options[:app]
		initialize_socket(options)
		setup_socket
	end

	def started?
		@started
	end

	def initialize_socket
		# implemented by child classes
	end

	def setup_socket
		@socket.listen(511)
		@socket.setsockopt(IPPROTO_TCP, TCP_NODELAY, 1)
		@socket.setsockopt(IPPROTO_TCP, TCP_DEFER_ACCEPT, 1) 
		@socket.fcntl(::Fcntl::F_SETFL, ::Fcntl::O_NONBLOCK)
	end

	def start
		@started = true
		@reactor.attach(:read, @socket) do |socket, reactor|
			begin
				conn = @handler.new(socket.accept_nonblock, self)
				begin
					@connections[conn.object_id] = conn
					conn.handle_request
					@connections.delete(conn.object_id) if conn.closed?
				rescue EOFError, Errno::ECONNRESET, Timeout::Error => e
				  puts e
					conn.close unless conn.closed?
					@connections.delete(conn.object_id)
				rescue Exception => e
					puts e
					conn.close unless conn.closed? # close the request now 
					@connections.delete(conn.object_id)
				end
			rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR 
				# do nothing
			rescue Exception => e
				puts e				
			end
		end
	end

	def stop!
		stop
		@socket.close
		@connections.each{|c| c.close }
		@connections = {}
	end

	def stop
		@started = false
		@reactor.detach(:read, @socket)
	end

end
