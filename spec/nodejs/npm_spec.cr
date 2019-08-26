require "../spec_helper"

alias Npm = Nodejs::Npm

describe Npm do
  it "npm init" do
    res = Npm.init
    res.should be_true
  end

  it "Check npm install module(No install)" do
    target_module = "jquery"
    Npm.uninstall(target_module)
    res = Npm.is_installed?(target_module)
    res.should be_false
  end

  it "npm install latest module" do
    res = Npm.install("jquery")
    res.should be_true
    res = Npm.uninstall("jquery")
    res.should be_true
  end

  it "npm install module target version" do
    res = Npm.install("jquery@3.4.0")
    res.should be_true
    res = Npm.uninstall("jquery@3.4.0")
    res.should be_true
  end

  it "npm install module by package.json" do
    # spec/js/package.json
    res = Npm.install
    res.should be_true
    res = Npm.is_installed?("mathjs")
    res.should be_true
  end

  it "Check npm install module(installed)" do
    res = Npm.install("express")
    res.should be_true
    res = Npm.is_installed?("express")
    res.should be_true
  end
end
