require "../spec_helper"

alias Function = Nodejs::Function

describe Function do
  it "Set JS function that return to crystal" do
    res = Function.set_return_js
    res.empty?.should be_false
  end
end
