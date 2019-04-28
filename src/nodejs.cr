require "io"
require "./nodejs/*"

module Nodejs
  extend self

  def eval(source : String) : String
    io = IO::Memory.new
    Process.run("bin/libnode -e \"#{source}\"", shell: true, output: io)
    io.to_s.chomp
  end
end

