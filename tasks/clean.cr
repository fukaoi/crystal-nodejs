require "./defined"
require "file_utils"

class Clean < LuckyCli::Task
  summary "clean up"

  def call
    FileUtils.rm_r("bin") if Dir.exists?("bin")
    FileUtils.rm_r("lib") if Dir.exists?("lib")
    system("shards build")
    success("clean up")
  rescue e : Exception
    failed(e.to_s)
  end
end
