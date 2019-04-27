require "./defined"
require "file_utils"

class Build < LuckyCli::Task
  summary ""

  def call
    success("build done")
  rescue e : Exception
    failed(e.to_s)
  end
end
