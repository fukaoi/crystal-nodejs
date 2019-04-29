require "./defined"
require "file_utils"

class Build < LuckyCli::Task
  summary "Build wrapper binary libnode and crystal"

  def initialize
    @install_dir = "./ext"
    @objects = %w(ext/node_main.o ext/libnode.so.64)
  end

  def call
    unless ARGV.empty?
      @install_dir = ARGV[0]
    end

    cmd = "
      g++ ext/libnode.c \
      -o #{@install_dir}/libnode \
      -L./ #{@objects[0]} #{@objects[1]} \
      -Wl,-rpath=#{@install_dir}
    "
    system(cmd)
    success("build done")
  rescue e : Exception
    failed(e.to_s)
  end
end
