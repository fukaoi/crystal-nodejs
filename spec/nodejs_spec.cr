require "./spec_helper"

describe Nodejs do
  it "works" do
    code = <<-SRC
      console.log('spec');
    SRC
    Nodejs.eval(code)
  end
end
