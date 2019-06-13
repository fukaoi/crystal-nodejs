require "../../spec_helper"

Nodejs::Npm.init
unless Nodejs::Npm.is_installed?("mathjs")
  Nodejs::Npm.install("mathjs")
end

describe "require('mathjs')" do
  it "Round" do
    res = Nodejs.eval(
      <<-CMD
      const math = require("mathjs");
      toCrystal(math.round(0.10000, 3));
      CMD
    )
    res.should eq 0.1
  end

  it "Log" do
    res = Nodejs.eval(
      <<-CMD
      const math = require("mathjs");
      toCrystal(math.log(10000, 10));
      CMD
    )
    res.should eq 4
  end

  it "Log" do
    res = Nodejs.eval(
      <<-CMD
      const math = require("mathjs");
      toCrystal(math.sqrt(-4));
      CMD
    )
    res["im"].should eq 2
  end
end
