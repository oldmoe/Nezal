require 'connection/connection'
require 'unicorn_http'
require 'rack'

class NB::HTTPConnection < NB::Connection
	
	PARSER_COUNT = 40

	@@parsers = []
	
	PARSER_COUNT.times{@@parsers << ::Unicorn::HttpParser.new}

	attr_accessor :keepalive

	MAX_HEADER = 8 * 1024
	MAX_BODY = 8 * 1024

	LOCALHOST 			= '127.0.0.1'.freeze
	REMOTE_ADDR 		= 'REMOTE_ADDR'.freeze
	KEEP_ALIVE 			= 'Keep-Alive'.freeze
	CLOSE 					= 'Close'.freeze 
	DATE	 					= 'Date'.freeze 
	STATUS	 				= 'Status'.freeze 
	CONTENT_LENGTH 	= 'Content-Length'.freeze
	HTTP_CONNECTION = 'HTTP_CONNECTION'.freeze
	CONNECTION 			= 'CONNECTION'.freeze
	REQUEST_PATH 		= 'REQUEST_PATH'.freeze
	EXPIRE         	= 'Expires'.freeze
	PNG_FILE        = '.png'.freeze
	EXPIRY_TIME     = 7*24*60*60

  # Every standard HTTP code mapped to the appropriate message.
  HTTP_CODES = Rack::Utils::HTTP_STATUS_CODES.inject({}) do |hash,(code,msg)|
    hash[code] = "#{code} #{msg}"
    hash
  end

	def post_init		
		@data = ''
		@body = ''
		@env = {} unless @env
		@env[REMOTE_ADDR] =  @peer_address ||= (self === TCPSocket ? @conn.peeraddr.last : LOCALHOST) 
		@parser ||= @@parsers.shift || ::Unicorn::HttpParser.new		
		@keepalive = false
		@finished_headers = false
	end

	def receive_data(data)
		@data << data
		if @data.length > MAX_HEADER
			# we need to log this incident
			# and send back a proper error code
			close
			return
		end
		begin 
		  if @finished_headers
			# we should extract the body
				@parser.filter_body(@body, @data)
				# if the body gets too big we need to write it to a file (later)
				handle_http_request if @parser.body_eof?
		  elsif @parser.headers(@env, @data)
		    @finished_headers = true
		    # headers are done, let's handle keepalive now
        @keepalive = @env[HTTP_CONNECTION] == KEEP_ALIVE
		    @parser.filter_body(@body, @data)
		    handle_http_request if @parser.body_eof?
			end
		rescue Exception => e 
		  puts e
			raise e + @data
		end 
	end

  def handle_http_request
    @env['rack.input'] = ::StringIO.new(@body)
    path = @server.wdir + @env[REQUEST_PATH]
    path += 'index.html' if @env[REQUEST_PATH] == '/'
    headers = { }
    if @env[REQUEST_PATH].index(PNG_FILE) == (@env[REQUEST_PATH].length - 4)
      expire_time = Time.now + EXPIRY_TIME
      headers[EXPIRE] = expire_time.strftime("%a, %d %b %Y %H:%M:%S GMT")
    end
    # check if file exists
    if size = File.size?(path)
      headers[CONTENT_LENGTH]= size
      if size <= CHUNK_SIZE
        response = set_headers(200, headers)
        response << @server.file_cache[path] ||= File.read(path)
        write(response)
      else
        response = set_headers(200, headers)
        write(response)
        begin
          file = File.new(path)					
          stream(file)
        rescue Exception => e
          raise e
        ensure
          file.close
        end
      end
    else
      upstream					
    end
    finish	
  end

	# default impelmentation, others should override this
	def upstream
		file_not_found
	end

	def file_not_found
		write("HTTP/1.1 404 Not Found\r\nConnection: Close\r\n\r\n404 Not Found")
	end

	def set_headers(status, headers)
		response = "HTTP/1.1 #{HTTP_CODES[status.to_i] || status}\r\nDate: #{Time.now.httpdate}\r\nConnection: #{@keepalive ? KEEP_ALIVE : CLOSE}\r\n"
		headers.each do |key, value|
      response << if value =~ /\n/
										(value.split(/\n/).map!{|v| "#{key}: #{v}\r\n" }).join('')
									else
										"#{key}: #{value}\r\n"
									end
    end
		response << "\r\n"
	end	

	def finish
		if @keepalive
			post_init # reset the connection variables
			@parser.reset #rest the parser manually (much faster than creating a new one)
		else
			if @@parsers.length < PARSER_COUNT
				@parser.reset
				@@parsers << @parser 
			end
			close
		end
	end

end
