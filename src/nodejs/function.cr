module Nodejs::Function
  extend self

  RETURN_KEY_NAME = "toCrystal"

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
