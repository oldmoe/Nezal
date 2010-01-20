require 'daemons'
require 'orchestra/configurator'

module Orchestra

  class Daemonizer
    
    DEFAULT_PID_FILE = Orchestra::Configurator::DEFAULTS[:pid_file]
    
    def self.start(pid_file = DEFAULT_PID_FILE)
      running = self.running?(pid_file)
      pwd = Dir.pwd
      unless running 
        self.cleanup(pid_file)
        log = pwd + ::File::SEPARATOR + "Shihabd.log"
        Daemonize.daemonize( log , Orchestra::Configurator::DEFAULTS[:name])
        Dir.chdir(pwd)
        pid = File.open(pid_file, "w")
        pid.write(Process.pid)
        pid.close
      end
    end
    
    def self.stop( pid_file )
      pid_file ||= DEFAULT_PID_FILE 
      running = self.running?(pid_file)
      if running
        puts "Process running #{running} .. killing it"
        Process.kill(:TERM, self.pid(pid_file))
      else 
        puts "Process not running #{running}"
      end
      sleep 2
      if self.running?(pid_file)
        sleep 60 
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

