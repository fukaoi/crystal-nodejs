require "../spec_helper"

describe Nodejs::Function do
  it "Set JS function that return to crystal" do
    res = Nodejs::Function.set_return_js
    res.empty?.should be_false
  end
end
