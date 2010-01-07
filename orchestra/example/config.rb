# Sample Config file for Shehabd
# 
# Server can also be configured from command line and any command line arguement provided
# overrides the config file one

# set number of worker process to fork
# default : 1
workers 4

# set timeout after which if a worker process is still non responsive, it will be recycled
# default : 60 
timeout 20

# define a new listening address
# multiple calls can be provided
# you provide the listen call with a hash having the following options:
#     :host => host to bind to, default is "0.0.0.0"
#     :port => port to listen on, default is 9000
#     :dir => main application dir the server will be serving from 
listen({:host => "127.0.0.1", :port => 4000, :dir => "current" })

# listen on a unix socket file
# you provide the listen call with a hash having the following options:
#     :socket => unix domain socket file to bind to
#     :dir => main application dir the server will be serving from 
# commented out till socket support is in the act
#listen({:socket => "/tmp/shehabd.sock", :dir => "current" })

# define a pre_fork procedure to be called by maestro before forking 
# any new process
pre_fork do 
  puts "Hi"
end

# define a post_fork procedure to be called by newly called child 
# right after forking
post_fork do 
  puts "Hi"
end

