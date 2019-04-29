require "json"

module Nodejs::Values
  extend self

  enum Type
    JSInt
    JSFloat
    JSString
    JSJsonAny
    JSArray
    JSHash
  end

  def type(v) : Type
    res = Type
    case (v)
    when .is_a?(Float)
      res = Type::JSFloat
    when .is_a?(Int32|Int64)
      res = Type::JSInt
    when .is_a?(String)
      res = Type::JSString
    when .is_a?(JSON::Any)
      res = Type::JSJsonAny
    when .is_a?(Array)
      res = Type::JSArray
    when .is_a?(Hash)
      res = Type::JSHash
    else
      raise ValuesTypeException.new("No match type: #{v}")
    end
    res
  end

  def convert(v)
    typed : Type = type(v)
    case(typed)
    when Type::JSString
      v = %("#{v}")
    when Type::JSJsonAny, Type::JSHash
      v = v.to_json
    else
      v
    end
  end
end
