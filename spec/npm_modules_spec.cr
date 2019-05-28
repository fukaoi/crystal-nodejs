require "./spec_helper"

describe Nodejs do
  Spec.before_each do
    Nodejs::Npm.init
    unless Nodejs::Npm.is_installed?("ripple-lib")
      Nodejs::Npm.install("ripple-lib")
    end
    unless Nodejs::Npm.is_installed?("stellar-sdk")
      Nodejs::Npm.install("stellar-sdk")
    end
    unless Nodejs::Npm.is_installed?("mathjs")
      Nodejs::Npm.install("mathjs")
    end
  end

  it "module:ripple-lib" do
    code = <<-SRC
      'use strict';
      const RippleAPI = require('ripple-lib').RippleAPI;
      const api = new RippleAPI({
        server: 'wss://s2.ripple.com:443'
      });

      api.connect().then(() => {
        const myAddress = 'rJumr5e1HwiuV543H7bqixhtFreChWTaHH';
        return api.getAccountInfo(myAddress);
      }).then(info => {
        toCrystal({seq: info.sequence})
      }).then(() =>{
        return api.disconnect();
      }).then(() => {
        console.log('done and disconnected');
      }).catch(console.error);
    SRC
    res = Nodejs.eval(code)
    puts "verbose res: #{res}"
    res["seq"].as_i.should be > 0
  end

  it "module:js-stellar-sdk" do
    code = <<-SRC
    const StellarSdk = require('stellar-sdk')
    const server = new StellarSdk.Server('https://horizon.stellar.org');
    const accountId = 'GA7MC2WZT2RG7LOD7GA4MJ2CQ35ODPZKG2QXZT5O6K3F4642YG3CZP6C';

    server.transactions()
    .forAccount(accountId)
    .call()
    .then(function (page) {
      toCrystal({hash: page.records[0].hash})
    })
    .catch(function (err) {
        console.log(err);
    });
    SRC
    res = Nodejs.eval(code)
    puts "verbose res: #{res}"
    res["hash"].to_s.empty?.should be_false
  end

  it "module:mathjs" do
    res = Nodejs.file_run("spec/file_run_npm.js")
    puts "verbose res: #{res}"
    res["result"].to_s.to_i.should eq 14
  end
end
