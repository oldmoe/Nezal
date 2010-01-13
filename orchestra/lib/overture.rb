require 'optparse'
require 'configurator'
require 'maestro'
require 'daemonizer'

module Orchestra

  # Can name it prelude too :) ... or in less fun terms Launcher :(
  # That thing should take the arguements and translate it into a decent options hash
  # Pass it along to the maestro and we r done 
  
  class Overture 
    
    COMMANDS = %w(start stop restart reload)
  
    def initialize(argv)
      @argv = argv
      @server_opts = {}
      @maestro_opts = {}
      @configurator = Orchestra::Configurator.new()
      setup()
    end
    
    def setup
      @parser = OptionParser.new do |opts|
        opts.banner = "Usage: orchestra [options] #{COMMANDS.join('|')}"
        opts.separator ""
       
        opts.separator "Listen options:"    
        opts.on("-h", "--host   HOST", "Set default bind host to HOST  " +
                      "(default: #{Orchestra::Configurator::DEFAULTS[:servers].first[:host]}) " ) { |host|  @server_opts[:host] = host }
        opts.on("-p", "--port   PORT", Integer, "Set default port to listen on to PORT  " +
                      "(default: #{Orchestra::Configurator::DEFAULTS[:servers].first[:port]})") { |port|  @server_opts[:port] = port }
        opts.on("-s", "--socket FILE", "Set default unix domain socket to bind to FILE" ) { |file|  @server_opts[:socket] = file }
        opts.on("-d", "--dir    DIR", "Set server root dir to DIR") { |dir|   @server_opts[:dir] = dir }

        opts.separator "    Providing both --socket  and --host/--port honours --socket"                
        
        opts.separator ""
        opts.separator "Maestro options:"
        opts.on("-c", "--config   FILE", "Use config file FILE")  { |config|  @maestro_opts[:config_file] = config }
        opts.on("-w", "--workers  NUMBER", Integer, "Fork NUMBER of worker processes")  { |worker|  @maestro_opts[:workers] = worker }
        opts.on("-t", "--timeout  TIMEOUT", Float, "Recycle worker if nonresponsive for TIMEOUT") { |timeout| @maestro_opts[:timeout] = timeout}  

        opts.on("-P", "--pid FILE", "Set pid file to FILE") { |pid_file| @maestro_opts[:pid_file] = pid_file }
        opts.on("-U", "--user USER", "Run workers as user USER")  { |user| @maestro_opts[:user] = user }
        opts.on("-G", "--group GROUP", "Run workers with group GROUP")  { |group| @maestro_opts[:group] = group }        
        opts.on("-D", "--daemonize", "Run in a daemonized mode")  { |daemonize| @maestro_opts[:daemonize] = daemonize }  

        opts.separator "    The previous inline options overides config file options"
      end
    end
    
    def parse 
      @parser.parse! @argv
      @command = @argv.shift
      @configurator.listen(@server_opts)
      @configurator.load_config(@maestro_opts[:config_file])   
      @maestro_opts.each { |key, value|   @configurator.send key, value }
    end
    
    def run
      parse
      procs = {
        "start" => Proc.new do
                    puts "I am starting" 
                    Daemonizer.start(@configurator.configs[:pid_file]) if @configurator.configs[:daemonize]
                    Orchestra::Maestro.new(@configurator.configs).run 
                   end ,
        "stop"  => Proc.new do
                     Daemonizer.stop(@configurator.configs[:pid_file]) 
                   end , 
        "reload" => Proc.new do 
                      Daemonizer.reload(@configurator.configs[:pid_file]) 
                    end ,
        "restart" => Proc.new do 
                      Daemonizer.stop(@configurator.configs[:pid_file]) 
                      Daemonizer.start(@configurator.configs[:pid_file]) 
                      Orchestra::Maestro.new(@configurator.configs).run
                    end ,
      }
      procs[@command].call
    end
    
  end

end
