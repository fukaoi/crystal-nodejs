require "../spec_helper"

describe "Type checks" do
  it "Type check String" do
    res = Nodejs::Values.type("Spec")
    res.should eq Nodejs::Values::Type::JSString
	end

  it "Type check Int32" do
    res = Nodejs::Values.type(1234)
    res.should eq Nodejs::Values::Type::JSInt
	end

  it "Type check Int64" do
    res = Nodejs::Values.type(99999999999999999)
    res.should eq Nodejs::Values::Type::JSInt
	end

  it "Type check Float" do
    res = Nodejs::Values.type(0.0001503)
    res.should eq Nodejs::Values::Type::JSFloat
	end

  it "Type check JSON::Any and JSON String" do
    json_any = JSON.parse(
      %([{
        "address": "Crystal Road 1234",
        "location": {"lat": 12.3, "lng": 34.5}
      }]))
    res = Nodejs::Values.type(json_any)
    res.should eq Nodejs::Values::Type::JSJsonAny

    res = Nodejs::Values.type(json_any.to_json)
    res.should eq Nodejs::Values::Type::JSString
  end

	it "Type check Array" do
		res = Nodejs::Values.type([1, "data", 0.111])
    res.should eq Nodejs::Values::Type::JSArray
	end

	it "Type check Hash" do
		res = Nodejs::Values.type({"data" => "Hash"})
    res.should eq Nodejs::Values::Type::JSHash
	end
end

describe "Converts" do
	it "Convert js type String" do
		res = Nodejs::Values.convert("Spec")
		res.should eq "\"Spec\""
	end

	it "Convert js type Int32" do
		res = Nodejs::Values.convert(99999)
		res.should eq 99999
	end

	it "Convert js type Float32" do
		res = Nodejs::Values.convert(0.01)
		res.should eq 0.01
	end

	it "Convert js type JSON String" do
		res = Nodejs::Values.convert("{\"key\":\"value\"}")
		res.should eq %("{\"key\":\"value\"}")
	end

	it "Convert js type JSON::Any" do
		res = Nodejs::Values.convert(JSON.parse("{\"key\":\"value\"}"))
		res.should eq "{\"key\":\"value\"}"
	end

	it "Convert js type Array" do
		res = Nodejs::Values.convert(["a", "b", "c", "d"])
		res.should eq ["a", "b", "c", "d"]
	end

	it "Convert js type Hash" do
		res = Nodejs::Values.convert({"data" => "Hash"})
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
