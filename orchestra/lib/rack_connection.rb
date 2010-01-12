require 'http_connection'

module NB::RackConnectionHandler

	include NB::HTTPConnectionHandler

  DEFAULTS = {
    "rack.errors" => STDERR,
    "rack.multiprocess" => true,
    "rack.multithread" => false,
    "rack.run_once" => false,
    "rack.version" => [1, 0],
    "SCRIPT_NAME" => "",
  }

	def post_init
		super
		@env = DEFAULTS.dup
	end
	
	def upstream
		status, headers, body = *(@server.app.call(@env))
		response = set_headers(status, headers)
		write(response)
		if body
			if ! body.is_a? file
				if !body.empty
					body.each{ |chunk| write(chunk) }
				end
			else
				stream(body)
			end
		end
		body.close
	end

end
