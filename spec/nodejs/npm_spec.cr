require "../spec_helper"

alias Npm = Nodejs::Npm

describe Npm do
  Spec.after_each do 
    spec_path = File.dirname(__FILE__)
    FileUtils.rm_r("#{spec_path}/../js/node_modules") if Dir.exists?("#{spec_path}/../js/node_modules")
    FileUtils.rm_r("#{Dir.current}/node_modules") if Dir.exists?("#{Dir.current}/node_modules")
    File.delete("#{Dir.current}/package.json") if File.exists?("#{Dir.current}/package.json")
    File.delete("#{Dir.current}/package-lock.json") if File.exists?("#{Dir.current}/package-lock.json")
  end
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
    path = File.dirname(__FILE__)
    res = Npm.at("#{path}/../js").install
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
