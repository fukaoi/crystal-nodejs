require "io"
require "./nodejs/*"

module Nodejs
  extend self

  NODE_PATH = "#{Internal.home_dir}/bin/node"

  def eval(source_code : String) : JSON::Any
    # use make audit
    Internal.create_raw_js(source_code) unless ENV["RAW_JS"]? == nil

    io = IO::Memory.new
    io_error = IO::Memory.new
    status = Process.run(
      NODE_PATH,
      args: {"-e", "#{Function.set_return_js} #{source_code}"},
      env: Internal.setup_node_path(Internal.scanning_sub_dir),
      output: io,
      error: io_error
    )

    io.close
    io_error.close

    results = Internal.extract_result(io.to_s.chomp)
    Internal.display_debug(results[:output])

    unless status.success?
      raise JSSideException.new("Nodejs.eval error: #{io_error}")
    end

    results[:result]
  end

  def file_run(file_path : String) : JSON::Any
    unless File.exists?(file_path)
      raise CrystalSideException.new("File not found: #{file_path}")
    end
    eval(Internal.replace_relative_absolute_path(File.read(file_path)))
  end

  def load_jsfile(file_path : String) : String
    path = "#{Internal.home_dir}/js/#{file_path}"
    unless File.exists?(path)
      raise CrystalSideException.new("File not found: #{path}")
    end
    Internal.replace_relative_absolute_path(File.read(path))
  end

  def replace_params(
    source_code : String,
    replaces : Hash = {String => String | Int32 | Float32}
  ) : String
    replaces.each do |k, v|
      matched = /(?:const|var|let)\s+#{k}\s+=\s((?:\{.*(?=})})|(?:\d+)|(?:\".+\")|(?:\'.+\')|(?:\[.*(?=\])\])|(?:[a-zA-Z.$0-9()'"]+))/.match(source_code)
      unless matched
        raise CrystalSideException.new("No match key:#{k}")
      end
      source_code = source_code.sub(matched.try &.[1], Converter.convert_js(v)
      )
    end
    source_code
  end

  def version : Void
    status = system("#{NODE_PATH} -v")
    raise CrystalSideException.new("node version") unless status
  end
end
