require "io"
require "./nodejs/*"

module Nodejs
  extend self

  def eval(source : String) : String
    #todo: process.wait ? fiber nonblocking
    io = IO::Memory.new
    io_error = IO::Memory.new
    status = Process.run("bin/libnode", args: {"-e", source}, output: io, error: io_error)
    unless status.success?
      raise  SystemException.new("Exec libnode: #{io_error.to_s}")
    end
    io.close
    io_error.close
    io.to_s.chomp
  end
end
