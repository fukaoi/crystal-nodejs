require "./spec_helper"

describe Nodejs do
  it "Console output" do
    mess = "spec"
    code = <<-SRC
      console.log('#{mess}');
    SRC
    res = Nodejs.eval(code)
    res.should eq mess
  end

  it "Throw error object with non local exit" do
    code = <<-SRC
      throw new Error('non local exit');
    SRC
    expect_raises(Nodejs::SystemException) do
      Nodejs.eval(code)
    end
  end

  it "Illegal return" do
    code = <<-SRC
      return false;
    SRC
    expect_raises(Nodejs::SystemException) do
      Nodejs.eval(code)
    end
  end

  it "Throw error object" do
    mess = "spec error"
    code = <<-SRC
    try {
      throw new Error('#{mess}');
    } catch(e) {
      console.log(e.message);
    }
    SRC
    res = Nodejs.eval(code)
    res.should eq mess
  end

  it "Exec setTimeout" do
    mess = "Hello, crystal!"
    code = <<-SRC
    let user = {
      sayHi(firstName) {
        console.log(`Hello, ${firstName}!`);
      }
    };
    setTimeout(() => {user.sayHi('crystal')}, 2000);
    SRC
    res = Nodejs.eval(code)
    res.should eq mess
  end

  it "Exec promise chain" do
    mess = "777"
    code = <<-SRC
    const promise = new Promise((resolve) =>{
      resolve(777);
    });
    promise.then((value) => {
      console.log(value);
    }).catch((error) => {
      console.error(error);
    });
    SRC
    res = Nodejs.eval(code)
    res.should eq mess
  end

  it "Error promise chain" do
    mess = "error promise"
    code = <<-SRC
    const promise = new Promise((resolve, reject) =>{
      reject(#{mess});
    });
    promise.then((value) => {
      console.log(value);
    }).catch((error) => {
      console.error(error);
    });
    SRC
    expect_raises(Nodejs::SystemException, mess) do
      Nodejs.eval(code)
    end
  end

  it "Replace JS param to Crystal param" do
    code = <<-SRC
      const srv = process.env.SERVER;
      const quorum = process.env.DB;let password = process.env.PASSWORD
    SRC
    hash = {
      "server"   => "http://localhost",
      "DB"       => "PostgreSQL",
      "Password" => 11111111390,
    }

    expect = <<-SRC
      const srv = "http://localhost";
      const quorum = "PostgreSQL";let password = 11111111390
    SRC
		res = Nodejs.replace_params(code, hash)
		res.should eq expect
		Nodejs.eval(res).empty?.should be_true
	end

  it "Replace complex JS param to Crystal param" do
    code = <<-SRC
      let groups = process.env.GROUPS;
      groups.forEach((group) => {
				console.log(group);
      });
      console.log('re:', groups);

      const values = process.env.VALUES;
    SRC

    hash = {
      "groups"   => [1,2,3,4],
      "values"   => {"a" => 10, "b" => "data", "c" => 0.5},
    }

    expect = <<-SRC
      let groups = [1, 2, 3, 4];
      groups.forEach((group) => {
				console.log(group);
      });
      console.log('re:', groups);

      const values = {"a":10,"b":"data","c":0.5};
    SRC
		res = Nodejs.replace_params(code, hash)
    res.should eq expect
    Nodejs.eval(res).empty?.should be_false
	end

  it "Replace lower, upper case" do
   code = <<-SRC
      const srv = process.env.WebServer;
      const db = process.env.dataBase;
    SRC

    hash = {
      "webserver" => "https://example.com",
      "database"  => "MySQL"
    }

    expect = <<-SRC
      const srv = "https://example.com";
      const db = "MySQL";
    SRC
		res = Nodejs.replace_params(code, hash)
    p res
    res.should eq expect
  end
end
