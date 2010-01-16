require 'neverblock'
require 'server/server'

class NB::UNIXServer < NB::Server
	
	def initialize_socket(options)	
		@socket = if options[:socket]
								options[:socket]
							elsif options[:host] && options[:port] 
								::UNIXServer.new(options[:path])
							else
								raise "Invalid socket option"
							end
	end

end
