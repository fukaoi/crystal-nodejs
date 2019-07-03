require "json"

module Nodejs::Values
  extend self

  RETURN_KEY_NAME = "toCrystal"

  def convert_js(v)
    case (v)
    when String
      v = %("#{v}")
    when JSON::Any, Hash
      v = v.to_json
    else
      v
    end
  end

  def convert_crystal(v)
    case (v)
    when String
      v = %("#{v}")
    when JSON::Any, Hash
      v = v.to_json
    else
      v
    end
  end

  def set_return_js : String
    <<-CODE
    function toCrystal(result) {
      try {
        JSON.parse(result);
        console.log(`{"#{RETURN_KEY_NAME}":${result}}`);
      } catch (e) {
        console.log(JSON.stringify({#{RETURN_KEY_NAME}: result}));
      }
    }

    function toCrystalErr(error) {
      console.error(error);
      process.exit(1);
    }
    CODE
  end
end
