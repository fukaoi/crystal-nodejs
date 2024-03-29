require "./spec_helper"

alias JSSideException = Nodejs::JSSideException
alias CrystalSideException = Nodejs::CrystalSideException

describe Nodejs do
  it "Exec eval with plain text" do
    code = <<-CODE
    toCrystal("spec")
    CODE
    res = Nodejs.eval(code)
    res.should eq "spec"
  end

  it "Exec eval with Number" do
    code = <<-CODE
    toCrystal(123)
    CODE
    res = Nodejs.eval(code)
    res.should eq 123
  end

  it "Exec eval with JS Object" do
    code = <<-CODE
    toCrystal({data:"spec"})
    CODE
    res = Nodejs.eval(code)
    res["data"].should eq "spec"
  end

  it "Exec eval with JSON" do
    code = <<-CODE
    toCrystal('{"data":"spec"}')
    CODE
    res = Nodejs.eval(code)
    res["data"].should eq "spec"
  end

  it "Throw error object with non local exit" do
    code = <<-SRC
      throw new Error('non local exit');
    SRC
    expect_raises(JSSideException) do
      Nodejs.eval(code)
    end
  end

  it "Illegal return" do
    code = <<-SRC
      return false;
    SRC
    expect_raises(JSSideException) do
      Nodejs.eval(code)
    end
  end

  it "Throw error object" do
    mess = "spec error"
    code = <<-SRC
    try {
      throw new Error('#{mess}');
    } catch(e) {
      toCrystalErr(e);
    }
    SRC
    expect_raises(JSSideException, mess) do
      Nodejs.eval(code)
    end
  end

  it "Exec setTimeout" do
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
      toCrystal({promise: value});
    }).catch((error) => {
      toCrystalErr(error);
    });
    SRC
    res = Nodejs.eval(code)
    res["promise"].should eq mess
  end

  it "Error promise chain" do
    mess = "error promise"
    code = <<-SRC
    const promise = new Promise((resolve, reject) =>{
      reject('#{mess}');
    });
    promise.then((value) => {
      console.log(value);
    }).catch((error) => {
      toCrystalErr(error);
    });
    SRC
    expect_raises(JSSideException, mess) do
      Nodejs.eval(code)
    end
  end
end

describe "Replace from JS raw code to param" do
  it "Replace JS param to Crystal param" do
    code = <<-SRC
      const srv = process.env.SERVER;
      const quorum = process.env.DB;const password = process.env.PASSWORD
    SRC
    hash = {
      "srv"      => "http://localhost",
      "quorum"   => "1000",
      "password" => 11111111390,
    }

    expect = <<-SRC
      const srv = "http://localhost";
      const quorum = "1000";const password = 11111111390
    SRC
    res = Nodejs.replace_params(code, hash)
    res.should eq expect
    Nodejs.eval(res).size.should eq 0
  end

  it "Replace complex JS param to Crystal param" do
    code = <<-SRC
      const groups = process.env.GROUPS;
      groups.forEach((group) => {
				console.log(group);
      });
      console.log('re:', groups);

      const values = process.env.VALUES;
    SRC

    hash = {
      "groups" => [1, 2, 3, 4],
      "values" => {"a" => 10, "b" => "data", "c" => 0.5},
    }

    expect = <<-SRC
      const groups = [1, 2, 3, 4];
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
      const webserver = config.get('webserver');
      const database    = 'PostgreSQL';
    SRC

    hash = {
      "webserver" => "https://example.com",
      "database"  => "MySQL",
    }

    expect = <<-SRC
      const webserver = "https://example.com";
      const database    = "MySQL";
    SRC
    res = Nodejs.replace_params(code, hash)
    res.should eq expect
  end

  it "libnode version" do
    Nodejs.version
  end
end

describe "Read js code file and Eval js code" do
  it "read example js file" do
    FileUtils.cp("spec/js/disp.js", "#{Nodejs::Internal.home_dir}/js/disp.js")
    res = Nodejs.file_run("spec/js/file_run.js")
    res["text"].to_s.empty?.should be_false
  end

  it "read example js file in sub directory" do
    subdir = "#{Nodejs::Internal.home_dir}/js/demo"
    FileUtils.mkdir(subdir)
    FileUtils.cp("spec/js/disp.js", "#{subdir}/disp.js")
    res = Nodejs.file_run("spec/js/file_run.js")
    FileUtils.rm_rf(subdir)
    res["text"].to_s.empty?.should be_false
  end

  it "Not found js file" do
    expect_raises(CrystalSideException) do
      Nodejs.file_run("spec/js/hoge_fuga.js")
    end
  end

  it "Not found js file" do
    expect_raises(CrystalSideException) do
      Nodejs.load_jsfile("spec/js/hoge_fuga.js")
    end
  end

  it "Call math module from js file" do
    res = Nodejs.file_run("spec/js/file_run_npm.js")
    res["result"].to_s.to_i.should eq 14
  end
end
