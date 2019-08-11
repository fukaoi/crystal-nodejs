require "../spec_helper"

describe "Version" do
  it "Create written raw js" do
    code = "spec"
    hash = Digest::MD5.hexdigest(code)
    Nodejs::Internal.create_raw_js(code)
    File.exists?("/tmp/raw_js/#{hash}")
  end
end

describe "Extract result data from result string code" do
  it "Exec extract" do
    code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
      '{"#{Nodejs::Converter::RETURN_KEY_NAME}":{"data":{"number":7777777777}}}'
			xklx;zxkl0932fijgv09329023333
		SRC
    tuple = Nodejs::Internal.extract_result(code)
    tuple[:result]["data"]["number"].should eq 7777777777
    tuple[:output].empty?.should be_false
  end

  it "Exec extract in no json data" do
    code = <<-SRC
			lslkfkldklsklklfaowpwp
			10320093903490902o2ioio3i3i3
			xklx;zxkl0932fijgv09329023333
		SRC
    tuple = Nodejs::Internal.extract_result(code)
    tuple[:result].size.should eq 0
    tuple[:output].empty?.should be_false
  end
end
