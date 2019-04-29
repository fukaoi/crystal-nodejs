require "io"
require "./nodejs/*"

module Nodejs
  extend self

  def eval(source_code : String) : String
    # todo: process.wait ? fiber nonblocking
    io = IO::Memory.new
    io_error = IO::Memory.new
    status = Process.run("ext/libnode", args: {"-e", source_code}, output: io, error: io_error)
    unless status.success?
      raise SystemException.new("Exec libnode: #{io_error.to_s}")
    end
    io.close
    io_error.close
    io.to_s.chomp
  end

  def replace_params(
    source_code : String,
    replaces : Hash = {String => String | Int32 | Float32}
  ) : String
    prefix = "process.env"
    replaces.each do |k, v|
      source_code = source_code.sub(/#{prefix}.#{k}/i, Nodejs::Values.convert_js(v)
			)
    end
    source_code
  end
 
  def version : Void
    status = system("ext/libnode -v")
    raise SystemException.new("libnode version") unless status
  end
end
