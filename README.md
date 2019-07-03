# crystal-nodejs

[![Build Status](https://travis-ci.org/fukaoi/crystal-nodejs.svg?branch=master)](https://travis-ci.org/fukaoi/crystal-nodejs)

Node.js engine for crystal-lang. JS code and npm module executes on crystal-nodejs, And don't need to install Node.js binary.Explain about architecture, Compiled as a shared object Node.js(i.e: libnodejs) and execute as one process on crystal-lang. So call C execvp() system call through Process.run() method, execute in this c function.

Process.run method is low overhead, Compare pure Node.js js code and crystal-nodejs js code, There was no difference in performance(see Benchmark heading  about performance detail).

Using crystal-nodejs can pass through  Node.js result of crystal-lang. Happy Crystaling!! :tada:

<h4>Architecture image</h4>
<img src="docs/architecture_image.png">

In the above architecture image, crystal-nodejs provides Node.js, LibC, lib that was created crystal-lang


## Supported OS

- Linux(Ubuntu16.04, 18.04)
- MacOSX(High Sierra)
- Windows(Unfortunately yet not supported on crystal-lang...)

## Installation

1. Add the dependency to your `shard.yml`:

```yaml
  dependencies:
     nodejs:
       github: fukaoi/crystal-nodejs
```

2. Run `shards install`


3. libnodejs install, init js directory `make or make all`.So created $HOME/.crystal-nodejs/

```
$HOME/.crystal-nodejs/
├── bin        // Use binary in crystal-nodejs
│   ├── node  
│   ├── npm 
│   └── npx
├── js         // Origina JS code, package.json
└── lib        // shared object for Node.js
    └── libnode.so.64(libnode.64.dylib)

```


## Usage

### Bacis usage

#### Output Hello crystal-nodejs !! on terminal

* Simple JS code, output 'Hello crystal-nodejs'

```js
require "nodejs"

Nodejs.eval("console.log('Hello crystal-nodejs !!')")
```
<br />

#### Use setTimeout execute lazy code

* below code is output 'Hello crystal' after 2sec

```crystal
require "nodejs"

code = <<-CODE
  let user = {
    sayHi(firstName) {
      console.log(`Hello, ${firstName}!`);
    }
  };
  setTimeout(() => {user.sayHi('crystal')}, 2000);
CODE

Nodejs.eval(code)
```
<br />

#### How to send Node.js result to crystal-lang

* Use special `toCrystal()` method.toCrystal() is only function in crystal-nodejs.Can response various type in JS,  and all JS type is converted `JSON::Any` in crystal

```crystal
require "nodejs"

code = <<-CODE
  toCrystal({data:"spec"})
CODE

res = Nodejs.eval(code)

puts res           # {"data" => "spec"}
puts typeof(res)   # JSON::Any
```
<br />

* The below example, all JS type(Number, Boolean, String) is converted `JSON::Any`.
```crystal
require "nodejs"

code = <<-CODE
  toCrystal({123456})
CODE

res = Nodejs.eval(code)

puts res           # 123456
puts typeof(res)   # JSON::Any
```

<br />

###  Use NPM(node modules) 

Node modules is installed in $HOME/.crystal-nodejs/js/

#### npm install method

* Use Nodejs::Npm.install('package name') method, can install need package.this below example is for use [mathjs](https://www.npmjs.com/package/mathjs) module.

```crystal
require "nodejs"
Nodejs::Npm.install("mathjs")

code = <<-CODE
  const math = require("mathjs"); // Note: JS side require
  toCrystal(math.log(10000, 10));
CODE

puts Nodejs.eval(code) # 4
```
<br />

#### package.json

* a package.json copy to $HOME/.crystal-nodejs/js/ direcotry, and call NodeJs::Npm.install method

[package.json]
```js
"dependencies": {
  "mathjs": "^6.0.2"
}
```

```crystal
require "nodejs"
Nodejs::Npm.install

code = <<-CODE
  const math = require("mathjs"); // Note: JS side require
  toCrystal(math.log(10000, 10));
CODE

puts Nodejs.eval(code) # 4
```
<br />


### Use existing the JS file

#### loading JS file and execute

* existing js file to, use Node Js.file run method, can run on crystal-lang  

[file_run.js]
```js
const fs = require('fs');
fs.readFile('spec/nodejs_spec.cr', 'utf8', (err, text) => {
  console.log('text file!');
  toCrystal({text: text});
});
```

```crystal
require "nodejs"
puts Nodejs.file_run("./file_run.js")
```

<br />

#### Replace parameters in existing JS file

* Use Nodejs.replace_params() method, can set the customization value to the parameter of the existing js file from crystal-lang. this method merit don't have to modify existing js files and can use on crystal-lang

* replace parameter type can be only `const xxxxx`. 

[calc.js]
```js
const a = 10;
const b = 20;

const calc = (left_side, right_side) => {
  return left_side + right_side;
}

const res = calc(a, b);
console.log(res);
```

```crystal
require "nodejs"

code = File.read("./calc.js")
hash = {
  "a" => 100,  # const a = 100
  "b" => 200   # const b = 200
}

replaced_code = Nodejs.replace_params(code, hash)
Nodejs.eval(replaced_code)  # 300
```
<br />

### Catch JS Exception

#### throw errors directly

* throw Error in JS, it is converted as `JSSideExceptin` in crystal-lang. So can catch JSSIDEExcetpion in crystal-lang.  

```crystal
require "nodejs"

code = <<-CODE
  throw new Error('Error raise!');
CODE

Nodejs.eval(code)  
```

```crystal
Error: Error raise!
    at [eval]:10:9
    at Script.runInThisContext (vm.js:122:20)
    at Object.runInThisContext (vm.js:329:38)
    at Object.<anonymous> ([eval]-wrapper:6:22)
    at Module._compile (internal/modules/cjs/loader.js:776:30)
    at evalScript (internal/bootstrap/node.js:589:27)
    at startup (internal/bootstrap/node.js:265:9)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
 (Nodejs::JSSideException)
```

<br />

#### Error object throw after catch the JS Error with `try catch`  

* can pass an error object to crystal-lang by using a specific `toCrystalErr` method. 

```crystal
require "nodejs"

code = <<-CODE
  try {
    throw new Error('Error raise!');
  } catch(e) {
    toCrystalErr(e);
  }
CODE

Nodejs.eval(code)  
```

```crystal
Error: Error raise!
    at [eval]:10:8
    at Script.runInThisContext (vm.js:122:20)
    at Object.runInThisContext (vm.js:329:38)
    at Object.<anonymous> ([eval]-wrapper:6:22)
    at Module._compile (internal/modules/cjs/loader.js:776:30)
    at evalScript (internal/bootstrap/node.js:589:27)
    at startup (internal/bootstrap/node.js:265:9)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)
 (Nodejs::JSSideException)
```

 
#### More usages look at [spec/nodejs/npm/](https://github.com/fukaoi/crystal-nodejs/tree/master/spec/nodejs/npm)

## Benchmark

This benchmark is fibonacci and binary-search results, As can see from the result, crystal-nodejs is high performance.below at bar chart is response average time that executes 5 times fibonacci and binary-search. benchmark source code detail  is can see from URL link

* Machine spec: 
  * cpu: Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz  4core
  * memory: 16Gbyte 

<br />

* Benchmark code:  
  * fibonacci source: [Node.js](https://github.com/fukaoi/crystal-nodejs/blob/benchmark/bench/fibonacci.js) [crystal-lang](https://github.com/fukaoi/crystal-nodejs/blob/benchmark/bench/binarysearch.cr)
  * binary-search source: [Node.js](https://github.com/fukaoi/crystal-nodejs/blob/benchmark/bench/binarysearch.js) [crystal-lang](https://github.com/fukaoi/crystal-nodejs/blob/benchmark/bench/binarysearch.cr)   

<img src="docs/barchart.png">


#### Raw data(Benchmark result)

* fibonacci

|  -  | Node.js | crystal-nodejs |
| ---- | ---- | ---- |
|  1  | real 2m26.968s | real 2m27.337s |
|  2  | real 2m27.230s | real 2m27.263s |
|  3  | real 2m26.987s | real 2m28.058s |
|  4  | real 2m27.582s | real 2m26.672s |
|  5  | real 2m27.262s | real 2m26.831s |


* binary-search

|  -  | Node.js | crystal-nodejs |
| ---- | ---- | ---- |
|  1  | real 1m35.699s | real 1m35.962s |
|  2  | real 1m35.082s | real 1m32.018s |
|  3  | real 1m33.309s | real 1m35.212s |
|  4  | real 1m34.423s | real 1m33.830s |
|  5  | real 1m32.050s | real 1m33.530s |


## Development

#### Extension directory tree

```
crystal-nodejs/
ext/
├── libnode.cc     // main function for libnode.so
├── node_path.cr   // script for rewrite node path of npm
├── obj            // shared object of Linux, Mac OSX
│   └── 10.16.0
└── 10.16.0        // shared object dependency file and directory
    ├── bin
    ├── include
    └── lib
```

#### Create json class

* May want to convert crystal-lang json mapper type because response parameter from Nodejs.eval() method is all JSON::Any type. So the recommended tool is [jsontocr](https://github.com/molnarmark/jsontocr), very simple and easy.


#### Exception

* CrystalSideException ... Be thrown error in crystal-lang code
* JSSideException ... Be thrown error in JS code

#### Make tasks

* make build ... build libnode and deploy $HOME/.crystal-nodejs/ 
* make install ... using package.json, npm install of dependency modules
* make nodejs ... git clone Node.js and build
* make (all) ... Same task make build && make install
* make clean ... delete $HOME/.crystal-nodejs/ and temporaty directory

#### Safety

* Scan for vulnerabilities when build project. If be found vulnerabilities, build is supposed to fail.this logic execute `npm audit` command in Makefile.execute `npm audit --fix` command and build continue 

## Contributing

1. Fork it (<https://github.com/fukaoi/crystal-nodejs/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [fukaoi](https://github.com/fukaoi) - creator and maintainer
