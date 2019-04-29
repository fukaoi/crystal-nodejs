require "yaml"
require "colorize"

NODEJS_SOURCE_DIR = "#{EXTERNAL_DIR}/node"

###############################################

def debug(message)
  puts "\n"
  puts "[DEBUG]:#{message.colorize(:blue)}"
  puts "\n"
end

def failed(message)
  puts message.colorize(:red)
end

def success(message)
  puts message.colorize(:green)
end

private def count_cpu
  System.cpu_count.to_i
end
