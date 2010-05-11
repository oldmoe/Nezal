require 'daemons'
require 'orchestra/configurator'

module Orchestra

  class Daemonizer
    
    DEFAULT_PID_FILE = Orchestra::Configurator::DEFAULTS[:pid_file]
    
    def self.start(pid_file = DEFAULT_PID_FILE, &block)
      running = self.running?(pid_file)
      if running 
        error = -1
      else
        self.cleanup(pid_file)
        pwd = Dir.pwd
        log = pwd + ::File::SEPARATOR + "Shihabd.log"
        proc = Proc.new do
                            Dir.chdir(pwd)
                            pid = File.open(pid_file, "w")
                            pid.write(Process.pid)
                            pid.close
                            block.call 
                         end
        Daemonize.call_as_daemon( proc, log , Orchestra::Configurator::DEFAULTS[:name])
        sleep 5
        error = self.running?(pid_file) ? 0 : -2
      end
      error
    end
    
    def self.stop( pid_file )
      pid_file ||= DEFAULT_PID_FILE 
      running = self.running?(pid_file)
      if running
        puts "Process running #{running} .. Terminating it"
        Process.kill(:TERM, self.pid(pid_file))
      else 
        puts "Process not running #{running}"
        return
      end
      sleep 8
      if self.running?(pid_file)
        sleep 50 
        Process.kill(:KILL, self.pid(pid_file)) 
      end
      self.cleanup(pid_file)
    end
    
    def self.reload(pid_file=DEFAULT_PID_FILE) 
    end
    
    # Returns whether there is a process running with the pid existing in the file
    def self.running?(pid_file)
      pid = self.pid(pid_file)
      running = pid if ( Process.getpgid(pid) rescue false )
    end
    
    def self.pid( pid_file = DEFAULT_PID_FILE )
      begin 
        file = File.open(pid_file, "r") 
      rescue Errno::ENOENT   
        return nil
      end
      begin
        pid = Integer(file.readline)
      rescue ArgumentError 
        raise ArgumentError, "Content of Pid file in not a valid process id"
      end
      return pid
    end
    
    # Remove old pid files before start/stop/restart if process with the pid in file
    # doesnt exist
    def self.cleanup(pid_file)
      File.delete(pid_file) if File.exists?(pid_file) 
    end
    
  end

end

