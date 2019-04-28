@[Link(ldflags:
  "-lstdc++ -L#{__DIR__}/../../libnode #{__DIR__}/../../libnode/libbridge.so #{__DIR__}/../../libnode/libnode.so.64"
)]
# toodo: module Node
lib LibNodeJs

  struct Tuple
    type : LibC::Char*
    response : LibC::Char*
  end

  fun init : Void
  fun eval(code : LibC::Char*) : Tuple
  fun deinit : Void
  fun callback() : Void
end
