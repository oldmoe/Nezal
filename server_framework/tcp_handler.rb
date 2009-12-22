require 'fcntl'
require 'socket'
require 'reactor'

class Reactor::TCPHandler

	BUFFER_SIZE = 128

	def initialize(conn, reactor)
		@write_buffer = ''
		@conn = conn
		@reactor = reactor
		@close_scheduled = false
		@conn.fcntl(Fcntl::F_SETFL, Fcntl::O_NONBLOCK)
		# attempt to read data from the request right away
		# after that we attach to the reactor (unless the connection was closed)		
		begin	
			data = @conn.sysread(BUFFER_SIZE)
			data_received(data)
		rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR
			# do nothing
		end
		unless @conn.closed?
			@reactor.attach(:read, @conn) do |conn, reactor|
				begin
					data_received(@conn.sysread(BUFFER_SIZE))
				rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR
					# do nothing
				end
			end
		end
	end

	def data_received(data)
	end

	def write(data)
		begin
			@conn.syswrite(data)
		rescue Exception => e
			retry
		end
	end

	def writes(data)
		@write_buffer << data
		return if @reactor.attached?(:write, @conn)
		# attempt to write right away, but attach to reactor if not ready now
		begin
			written = @conn.syswrite(@write_buffer.slice(0, BUFFER_SIZE))
			@write_buffer.slice!(0, written) if written > 0
		rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR
			# do nothing
		end
		if @write_buffer.length > 0
			@reactor.attach(:write, @conn) do |conn, reactor|
				begin
					written = @conn.syswrite(@write_buffer.slice(0, BUFFER_SIZE))
					@write_buffer.slice!(0, written) if written > 0
					if @write_buffer.empty?
						@reactor.detach(:write, @conn) 
						close if @close_scheduled
					end
				rescue Errno::EWOULDBLOCK, Errno::EAGAIN, Errno::EINTR
					# do nothing
				end
			end
		else
			close if @close_scheduled
		end
	end

	def close(after_writing = true)		
		if !after_writing || @write_buffer.empty? 
			@conn.close unless @conn.closed?
			@reactor.detach(:read, @conn)
			@reactor.detach(:write, @conn)
		else
			@close_scheduled = true
		end
	end

end
