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

  it "npm install latest module" do
    res = Nodejs::Npm.install("jquery")
    res.should be_true
    res = Nodejs::Npm.uninstall("jquery")
    res.should be_true
  end

  it "npm install module target version" do
    res = Nodejs::Npm.install("jquery@3.3.0")
    res.should be_true
    res = Nodejs::Npm.uninstall("jquery@3.3.0")
    res.should be_true
  end

  it "npm install module by package.json" do
    # spec/js/package.json
    res = Nodejs::Npm.install
    res.should be_true
    res = Nodejs::Npm.is_installed?("mathjs")
    res.should be_true
  end

  it "Check npm install module(installed)" do
    res = Nodejs::Npm.install("express")
    res.should be_true
    res = Nodejs::Npm.is_installed?("express")
    res.should be_true
  end
end
