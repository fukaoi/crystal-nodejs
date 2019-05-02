require "io"
require "./nodejs/*"

module Nodejs
  extend self

  def eval(source_code : String) : JSON::Any
    # todo: process.wait ? fiber nonblocking
    io = IO::Memory.new
    io_error = IO::Memory.new
    status = Process.run("ext/libnode", args: {"-e", source_code}, output: io, error: io_error)
    unless status.success?
      raise NodejsException.new("Exec libnode: #{io_error.to_s}")
    end
    io.close
    io_error.close
    tuple = extract_result(io.to_s.chomp)
		display_output(tuple[:output])
		tuple[:result]
  end

  def file_run(file_path : String) : JSON::Any
    unless File.exists?(file_path)
      NodejsException.new("File not found: #{file_path}")
    end
    eval(File.read(file_path))
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
    raise NodejsException.new("libnode version") unless status
  end

	def extract_result(res : String) : NamedTuple(result: JSON::Any, output: String)
		matched = /\{.*\:.*\}/.match(res).try &.[0]
		result : JSON::Any
		output : String
    unless matched
			result = JSON.parse("{}")
			output = res
		else
			result = JSON.parse(matched.to_s)
			output = res.split(matched).join
		end
		{result: result, output: output}
	end

	private def display_output(output : String) : Void
		unless output.empty?
			puts("# -- debug or console.log(non json)) -- :\n#{output}")
		end
	end
end
