require "../spec_helper"

describe "convert_jss" do
	it "convert_js js type String" do
		res = Nodejs::Values.convert_js("Spec")
		res.should eq "\"Spec\""
	end

	it "convert_js js type Int32" do
		res = Nodejs::Values.convert_js(99999)
		res.should eq 99999
	end

	it "convert_js js type Float32" do
		res = Nodejs::Values.convert_js(0.01)
		res.should eq 0.01
	end

	it "convert_js js type JSON String" do
		res = Nodejs::Values.convert_js("{\"key\":\"value\"}")
		res.should eq %("{\"key\":\"value\"}")
	end

	it "convert_js js type JSON::Any" do
		res = Nodejs::Values.convert_js(JSON.parse("{\"key\":\"value\"}"))
		res.should eq "{\"key\":\"value\"}"
	end

	it "convert_js js type Array" do
		res = Nodejs::Values.convert_js(["a", "b", "c", "d"])
		res.should eq ["a", "b", "c", "d"]
	end

	it "convert_js js type Hash" do
		res = Nodejs::Values.convert_js({"data" => "Hash"})
		res.should eq  "{\"data\":\"Hash\"}"
	end
end

class Location
  JSON.mapping(
    lat: Float64,
    lng: Float64,
  )
end

class House
  JSON.mapping(
    address: String,
    location: {type: Location, nilable: true},
  )
end
