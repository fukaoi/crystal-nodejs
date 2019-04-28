require "../spec_helper"

describe Nodejs::Npm do
  Spec.after_each do
    system("rm -r ./lib/node_modules")
  end

  it "npm init" do
    res = Nodejs::Npm.init
    res.should be_true
  end

  it "Check npm install module(No install)" do
    res = Nodejs::Npm.is_installed?("jquery")
    res.should be_false
  end

  it "npm install module" do
    res = Nodejs::Npm.install("jquery")
    res.should be_true
  end

  it "Check npm install module(installed)" do
    Nodejs::Npm.install("jquery")
    res = Nodejs::Npm.is_installed?("jquery")
    res.should be_true
  end
end
