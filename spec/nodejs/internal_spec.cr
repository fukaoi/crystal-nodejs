require "../spec_helper"

alias Internal = Nodejs::Internal
alias Converter = Nodejs::Converter

describe "Create hash file" do
  it "Create written raw js" do
    code = "spec"
    hash = Digest::MD5.hexdigest(code)
    Internal.create_raw_js(code)
    File.exists?("/tmp/raw_js/#{hash}")
  end
end

describe "Extract result data from result string code" do
  it "Exec extract" do
    code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
      '{"#{Converter::RETURN_KEY_NAME}":{"data":{"number":7777777777}}}'
			xklx;zxkl0932fijgv09329023333
		SRC
    tuple = Internal.extract_result(code)
    tuple[:result]["data"]["number"].should eq 7777777777
    tuple[:output].empty?.should be_false
  end

  it "Exec extract in no json data" do
    code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
			xklx;zxkl0932fijgv09329023333
		SRC
    tuple = Internal.extract_result(code)
    tuple[:result].size.should eq 0
    tuple[:output].empty?.should be_false
  end
end

describe "Replace relative path" do
  it "require('xxxxxxx" do
    code = <<-SRC
      var fs = require("fs");
      var {output} = require('./original.js');
    SRC

    expect_code = <<-SRC
      var fs = require("fs");
      var {output} = require('original.js');
    SRC

    res = Internal.replace_relative_absolute_path(code)
    res.should eq expect_code
  end

  it "require(\"xxxxxxx" do
    code = <<-SRC
      var fs = require("fs");
      var {output} = require("./original.js");
    SRC

    expect_code = <<-SRC
      var fs = require("fs");
      var {output} = require("original.js");
    SRC

    res = Internal.replace_relative_absolute_path(code)
    res.should eq expect_code
  end

  it "require('xxxxxxx and require(\"xxxxxxx" do
    code = <<-SRC
      var fs = require("fs");
      var {output} = require('./original.js');
      var {output2} = require("./original2.js");
    SRC

    expect_code = <<-SRC
      var fs = require("fs");
      var {output} = require('original.js');
      var {output2} = require("original2.js");
    SRC

    res = Internal.replace_relative_absolute_path(code)
    res.should eq expect_code
  end
end

describe "Scan sub dir" do
  it "Get sub directory name" do
    dirpaths = [] of String
    dirpaths << "#{Internal.home_dir}/js/spec"
    dirpaths << "#{Internal.home_dir}/js/spec2"
    dirpaths.map { |dir| Dir.mkdir(dir) }
    res = Internal.scanning_sub_dir
    dirpaths.map { |dir| Dir.delete(dir) }
    res.size.should eq 4
  end

  it "No get sub directory" do
    res = Internal.scanning_sub_dir
    res.empty?.should be_true
  end
end
