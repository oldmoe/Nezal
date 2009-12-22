class Tester
  def initialize
    @tests = []
  end
  
  def setup
  end
  
  def teardown
  end
  
  def run
    @tests.each do |test|
      setup
      puts test[:message]
      begin
        if test[:proc][self]
          puts "success"
        else
          puts "failure"
        end
      rescue Exception => e
        puts "EXCEPTION"
        puts e.message
        puts e.backtrace
      end
      teardown
      sleep 1
    end
  end
  
  def test(message, &block)
    @tests << {:message => message, :proc => block}
  end
end

class SpawnTester < Tester
  
  attr_reader :pid, :title

  def setup
   @title = "MaestroTest"
   @pid = nil
   if @pid = fork
      # will exit here
      sleep 0.5
   else
    $0 = @title
    require '../lib/maestro.rb'
    server = Orchestra::Maestro.new
    server.run
   end 
  end
  
  def teardown
    Process.kill("TERM", @pid)  
  end
  
  def pcount
    (`ps aux | grep '#{@title}' | grep -v grep | wc -l `).to_i
  end
  
end

tester = SpawnTester.new
tester.test "kill the parent watch the master weep in despair" do |t|
  result = t.pcount
  puts "found #{result} processes, attempting to KILL"
  Process.kill("TERM", t.pid)
  sleep 1
  result = t.pcount
  puts "found #{result} processes after KILL"
  result == 0
end

tester.test "kill a child and wait for the parent to spawn a new one" do |t|
  before = t.pcount
  puts "found #{before} processes, attempting to kill a child"
  cpid = (`ps aux | grep '#{t.title}' | grep -v grep `).split("\n").last.split(' ')[1].to_i
  Process.kill("TERM", cpid)
  sleep 1
  after = t.pcount
  puts "found #{after} processes after KILL"
  after == before
end
 
tester.test "Send a USR1 sig to increase workers by 1" do |t|
  before = t.pcount
  puts "found #{before} processes, attempting to add a child"
  Process.kill("USR1", t.pid)
  sleep 1
  after = t.pcount
  puts "found #{after} processes after KILL"
  after == before + 1
end

tester.test "Send a USR2 sig to decrease workers by 1" do |t|
  before = t.pcount
  puts "found #{before} processes, attempting to kill a child"
  Process.kill("USR2", t.pid)
  sleep 1
  after = t.pcount
  puts "found #{after} processes after KILL"
  after == before - 1
end

tester.test "Test worker timeout" do |t|
  before = t.pcount
  puts "found #{before} processes, attempting to timeout a child"
  cpid = (`ps aux | grep '#{t.title}' | grep -v grep `).split("\n").last.split(' ')[1].to_i
  Process.kill("TSTP", cpid)
  puts "Sleeping for Timeout : 15"
  sleep 15
  found = (`ps aux | grep '#{t.title}' | grep -v grep | grep #{cpid}`)
  after = t.pcount
  msg = found.empty?? 'NOT FOUND' : 'Found' 
  puts "found #{after} processes after timeout .. Timedout process: #{msg}"
  after == before && found.empty?
end 
 
tester.run
