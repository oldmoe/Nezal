require 'optparse'
require 'orchestra/maestro'
require 'orchestra/daemonizer'

module Orchestra

  # That thing should take the arguements and translate it into a decent options hash
  # Pass it along to the maestro 
  # Use a daemonizer if we wanna daemonize and we r done 
  
  class Overture 
    
    COMMANDS = %w(start stop restart reload)
  
    def initialize(argv)
      @argv = argv
      @server_opts = {}
      @maestro_opts = {}
#      @configurator = Orchestra::Configurator.new()
      setup()
    end
    
    def setup
      @parser = OptionParser.new do |opts|
        opts.banner = "Usage: orchestra [options] #{COMMANDS.join('|')}"
        opts.separator ""
       
        opts.separator "Listen options:"    
        opts.on("-h", "--host   HOST", "Set default bind host to HOST  " +
                      "(default: #{Orchestra::Configurator::DEFAULTS[:server][:host]}) " ) { |host|  @server_opts[:host] = host }
        opts.on("-p", "--port   PORT", Integer, "Set default port to listen on to PORT  " +
                      "(default: #{Orchestra::Configurator::DEFAULTS[:server][:port]})") { |port|  @server_opts[:port] = port }
        opts.on("-s", "--socket FILE", "Set default unix domain socket to bind to FILE" ) { |file|  @server_opts[:socket] = file }
        opts.on("-d", "--dir    DIR", "Set server root dir to DIR") { |dir|   @server_opts[:dir] = dir }
        opts.on("-r", "--rackup   FILE", "Use rack config file FILE")  { |config|  @server_opts[:rackup] = config }

        opts.separator "    Providing both --socket  and --host/--port honours --socket"                
        
        opts.separator ""
        opts.separator "Maestro options:"
        opts.on("-c", "--config   FILE", "Use config file FILE")  { |config|  @maestro_opts[:config_file] = config }
        opts.on("-w", "--workers  NUMBER", Integer, "Fork NUMBER of worker processes")  { |worker|  @maestro_opts[:workers] = worker }
        opts.on("-t", "--timeout  TIMEOUT", Float, "Recycle worker if nonresponsive for TIMEOUT") { |timeout| @maestro_opts[:timeout] = timeout}  

        opts.on("-P", "--pid FILE", "Set pid file to FILE") { |pid_file| @maestro_opts[:pid_file] = pid_file }
        opts.on("-U", "--user USER", "Run workers as user USER")  { |user| @maestro_opts[:user] = user }
        opts.on("-G", "--group GROUP", "Run workers with group GROUP")  { |group| @maestro_opts[:group] = group }        
        opts.on("-D", "--daemonize", "Run in a daemonized mode")  { |daemonize| @maestro_opts[:daemonize] = true }  
        opts.on("-L", "--log Dir", "Use direcoty Dir for log files")  { |log| @maestro_opts[:log_dir] = log }

        opts.separator "    The previous inline options overides config file options"
      end
    end
    
    def parse 
      @parser.parse! @argv
      @command = @argv.shift
      @maestro = Orchestra::Maestro.new()
      @maestro.load_config(@maestro_opts[:config_file])   
      @maestro.listen(@server_opts, true) if @server_opts.keys.length > 0
      @maestro_opts.each { |key, value|  @maestro.send key, value }
    end
    
    def run
      parse
      procs = {
        "start" => Proc.new do
                    if @maestro.configs[:daemonize]
                      error = Daemonizer.start( @maestro.configs[:pid_file] || Orchestra::Configurator::DEFAULTS[:pid_file]) {@maestro.run}
                      if error == -1
                        puts "Error : Process might be already running ... "
                      elsif error == -2
                        puts "Error : Process failed to start ... Please check Shihabd.log for further info"
                      else
                        puts "Started Successfully ... "
                      end
                    else
                      @maestro.run 
                    end
                   end ,
        "stop"  => Proc.new do
                     Daemonizer.stop(@maestro.configs[:pid_file]) 
                   end , 
        "reload" => Proc.new do 
                      Daemonizer.reload(@maestro.configs[:pid_file]) 
                    end ,
        "restart" => Proc.new do 
                      Daemonizer.stop(@maestro.configs[:pid_file]) 
                      Daemonizer.start(@maestro.configs[:pid_file]) 
                      @maestro.run
                    end ,
      }
      procs[@command].call
    end
    
  end

end
