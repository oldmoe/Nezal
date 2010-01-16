require 'connection/http_connection'

class NB::RackConnection < NB::HTTPConnection

  DEFAULTS = {
    "rack.errors" => STDERR,
    "rack.multiprocess" => true,
    "rack.multithread" => false,
    "rack.run_once" => false,
    "rack.version" => [1, 0],
    "SCRIPT_NAME" => "",
    "SERVER_SOFTWARE"=>"Shehab 0.0.1"
  }

	def post_init
		@env = DEFAULTS.dup
		super
	end
	
	def upstream
    begin
		  status, headers, body = *(@server.app.call(@env))
		  response = set_headers(status, headers)
		  write(response)
		  if body
			    if ! body.is_a? File
				    if !body.empty?
					    body.each{ |chunk| write(chunk) }
				    end
			    else
				    stream(body)
			    end
		  end
  	ensure
  		body.close if ( body && (body.respond_to? :close) && (body.respond_to? :closed?) && !(body.closed?) )
  	end
	end

end
