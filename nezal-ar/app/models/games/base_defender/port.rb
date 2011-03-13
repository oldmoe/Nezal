require 'active_support'
require 'active_support/core_ext'
def match str
  m = str.match(/[a-z][A-Z]/)
  while(!m.nil?)
    str = str.sub(m[0], "#{m[0][0]}_#{m[0][1].downcase}")
    m = str.match(/[a-z][A-Z]/)
  end
  str
end
def port_file
  f = File.open(ARGV[0], 'r')
  data = []
  f.each_line do |line|  
    data << match(line)
  end
  data = data.join("")
  puts data
  f.close
end