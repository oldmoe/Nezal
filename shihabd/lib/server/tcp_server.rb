require 'neverblock'
require 'server/server'

class NB::TCPServer < NB::Server
		
	def initialize_socket(options)	
		@socket = if options[:socket]
								options[:socket]
							elsif options[:host] && options[:port] 
								::TCPServer.new(options[:host], options[:port])
							else
								raise "Invalid socket option"
							end
	end

end
