require "../spec_helper"

describe Nodejs::Values do
  it "Type check" do
    res = Nodejs::Values.type("Spec")
    res.should eq Nodejs::Values::Type::JSString

    res = Nodejs::Values.type(1234)
    res.should eq Nodejs::Values::Type::JSInt

    res = Nodejs::Values.type(99999999999999999)
    res.should eq Nodejs::Values::Type::JSInt

    res = Nodejs::Values.type(0.0001503)
    res.should eq Nodejs::Values::Type::JSFloat

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

	it "Convert js type" do
		res = Nodejs::Values.convert("Spec")
		res.should eq "\"Spec\""

		res = Nodejs::Values.convert(99999)
		res.should eq 99999

		res = Nodejs::Values.convert(0.01)
		res.should eq 0.01

		res = Nodejs::Values.convert("{\"key\":\"value\"}")
		res.should eq %("{\"key\":\"value\"}")

		res = Nodejs::Values.convert(JSON.parse("{\"key\":\"value\"}"))
		res.should eq "{\"key\":\"value\"}"
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
