require "../../spec_helper"

Nodejs::Npm.init
unless Nodejs::Npm.is_installed?("lodash")
  Nodejs::Npm.install("lodash")
end

describe "require('lodash')" do
  it "Defaults" do
    res = Nodejs.eval(
      <<-CMD
      const _ = require('lodash');
      const obj = _.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 });
      toCrystal(obj);
      CMD
    )

    expected = {"a" => 1, "b" => 2}
    res.should eq  expected
  end
end
