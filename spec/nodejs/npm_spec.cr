require "../spec_helper"

describe Nodejs::Npm do
  it "npm init" do
    res = Nodejs::Npm.init
    res.should be_true
  end

  it "Check npm install module(No install)" do
    target_module = "jquery"
    Nodejs::Npm.uninstall(target_module)
    res = Nodejs::Npm.is_installed?(target_module)
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
