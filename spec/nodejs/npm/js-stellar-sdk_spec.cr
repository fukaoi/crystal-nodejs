require "../../spec_helper"

describe "require('stellar-sdk')" do
  it "Get account info" do
    code = <<-SRC
      const StellarSdk = require('stellar-sdk')
      const server = new StellarSdk.Server('https://horizon.stellar.org');
      const accountId = 'GA7MC2WZT2RG7LOD7GA4MJ2CQ35ODPZKG2QXZT5O6K3F4642YG3CZP6C';

      server.transactions().forAccount(accountId).call()
      .then(function (page) {
        toCrystal({hash: page.records[0].hash})
      })
      .catch(function (err) {
        toCrystalErr(err);
      });
    SRC
    res = Nodejs.eval(code)
    res["hash"].to_s.empty?.should be_false
  end
end
