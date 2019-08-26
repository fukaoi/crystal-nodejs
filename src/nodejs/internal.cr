require "digest/md5"

module Nodejs::Internal
  extend self

  NODE_PATH = "#{home_dir}/bin/node"

  def home_dir : String
    "#{ENV["HOME"]}/.crystal-nodejs"
  end

  def extract_result(res : String) : NamedTuple(result: JSON::Any, output: String)
    matched = /\{"#{Converter::RETURN_KEY_NAME}"\:.*\}/.match(res).try &.[0]
    result = JSON.parse("{}")
    output : String
    if matched != nil
      result = JSON.parse(matched.to_s)[Converter::RETURN_KEY_NAME]
      output = res.split(matched).join
    else
      output = res
    end
    {result: result, output: output}
  end

  def setup_env(path : Array(String)) : Hash(String, String)
    js_dir = "#{ENV["HOME"]}/.crystal-nodejs/js"
    node_path = {
      "NODE_PATH" => ".:./:#{js_dir}:#{js_dir}/node_modules:",
    }
    if !path.empty?
      node_path["NODE_PATH"] = "#{node_path["NODE_PATH"]}:#{path.join(":")}"
    end
    node_path
  end

  def create_raw_js(raw : String) : Void
    hash = Digest::MD5.hexdigest(raw)
    dir = "/tmp/raw_js"
    unless Dir.exists?(dir)
      FileUtils.mkdir(dir)
    end
    File.write("#{dir}/#{hash}.js", raw)
  end

  def replace_relative_absolute_path(path : String)
    path.gsub(/(require\('\.\/)/, "require('")
      .gsub(/(require\("\.\/)/, "require(\"")
  end

  def display_debug(output : String) : Void
    unless output.empty?
      puts("#### console.log ####\n#{output}")
    end
  end
end
