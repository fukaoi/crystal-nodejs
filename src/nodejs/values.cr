require "json"

module Nodejs::Values
  extend self

  def convert_js(v)
    case(v)
    when String
      v = %("#{v}")
    when JSON::Any, Hash
      v = v.to_json
    else
      v
    end
  end

  def convert_crystal(v)
    case(v)
    when String
      v = %("#{v}")
    when JSON::Any, Hash
      v = v.to_json
    else
      v
    end
  end
end
