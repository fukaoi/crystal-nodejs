require "./spec_helper"

describe Nodejs do
  it "Console output" do
    mess = "spec"
    code = <<-SRC
      console.log('#{mess}');
    SRC
    res = Nodejs.eval(code)
    res.should eq mess
  end


end
