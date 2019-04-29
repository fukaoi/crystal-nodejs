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
      const quorum = process.env.DB;let quorum = process.env.PASSWORD
    SRC
    hash = {
      "server"   => "http://localhost",
      "DB"       => "PostgreSQL",
      "Password" => 11111111390,
    }
    res = Nodejs.replace_params(code, hash)
    p res
  end
end
