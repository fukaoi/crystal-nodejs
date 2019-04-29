require "./spec_helper"

describe "Execute JS code" do
  it "Console output" do
    mess = "spec"
    code = <<-SRC
      const json = JSON.stringify({message: "#{mess}"});
      console.log(json);
    SRC
    res = Nodejs.eval(code)
		res["message"].should eq mess
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
      const json = JSON.stringify({error_message: e.message})
      console.log(json);
    }
    SRC
    res = Nodejs.eval(code)
		res["error_message"].should eq mess
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
		res.size.should eq 0
  end

  it "Exec promise chain" do
    mess = 777
    code = <<-SRC
    const promise = new Promise((resolve) =>{
      resolve(777);
    });
    promise.then((value) => {
      const json = JSON.stringify({promise: value})
      console.log(json);
    }).catch((error) => {
      console.error(error);
    });
    SRC
    res = Nodejs.eval(code)
		res["promise"].should eq mess
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
end

describe "Replace from JS raw code to param" do
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
		Nodejs.eval(res).size.should eq 0
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
		Nodejs.eval(res).size.should eq 0
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
    res.should eq expect
  end

  it "libnode version" do
    Nodejs.version
  end
end

describe "Extract result data from result string code" do
	it "Exec extract" do
		code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
      '{"result":{"data":7777777777}}'
			xklx;zxkl0932fijgv09329023333
		SRC
		tuple = Nodejs.extract_result(code)
		tuple[:result]["result"]["data"].should eq 7777777777
		tuple[:output].empty?.should be_false	
	end

	it "Exec extract in no json data" do
		code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
			xklx;zxkl0932fijgv09329023333
		SRC
		tuple = Nodejs.extract_result(code)
		tuple[:result].size.should eq 0
		tuple[:output].empty?.should be_false
	end	
end
