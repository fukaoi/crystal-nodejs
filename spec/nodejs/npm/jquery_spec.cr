require "../../spec_helper"

Nodejs::Npm.init
unless Nodejs::Npm.is_installed?("jquery")
  Nodejs::Npm.install("jquery")
end
unless Nodejs::Npm.is_installed?("jsdom")
  Nodejs::Npm.install("jsdom")
end

describe "require('jquery')" do
  it "Parse dom" do
    res = Nodejs.eval(
      <<-CMD
      const jsdom = require('jsdom');
      const { JSDOM } = jsdom;
      const dom = new JSDOM(`<html><body><div id="aaa">AAA<div></body></html>`);
      const { document } = dom.window;
      const jquery = require('jquery');
      const $ = jquery(dom.window);
      toCrystal($('#aaa').text());
      CMD
    )
    res.should eq "AAA"
  end
end
