# crystal-nodejs

Node.js engine for crystal-lang. JS code and npm module executes on crystal-nodejs, And don't need to install Node.js binary.Explain about architecture, Compiled as a shared object Node.js(i.e: libnodejs) and execute as one process on crystal-lang. So call C execvp() system call through Process.run() method, execute in this c function.

Process.run method is low overhead, Compare pure Node.js js code and crystal-nodejs js code, There was no difference in performance(see Benchmark heading  about performance detail).

Using crystal-nodejs can pass through  Node.js result of crystal-lang. Happy Crystaling!! :tada:

## Supported OS

- Linux(Ubuntu16.04, 18.04)
- MacOSX(Processing)

## Installation

1. Add the dependency to your `shard.yml`:

   ```yaml
   dependencies:
     nodejs:
       github: fukaoi/crystal-nodejs
   ```

2. Run `shards install`


3. libnodejs install, init js directory `make or make all`


## Usage

##### Display `Hello world` on terminal

* aaaa

```js
require "nodejs"

Nodejs.eval("console.log('Hello crystal-nodejs !!')")
```

##### setTimeout
```js
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

##### How to send Node.js result to crystal-lang

* Use special `toCrystal()` method. 

```js
require "nodejs"

code = <<-CODE
  let user = {
    sayHi(firstName) {
      toCrystal(`Hello, ${firstName}!`);
    }
  };
  setTimeout(() => {user.sayHi('crystal')}, 2000);
CODE

Nodejs.eval(code)
```


##### More usages look at [spec/nodejs/npm/](https://github.com/fukaoi/crystal-nodejs/tree/master/spec/nodejs/npm)

## Benchmark

This benchmark is fibonacci and binary-search results, As can see from the result, crystal-nodejs is high performance. 

* Machine spec: 
  * cpu: Intel(R) Core(TM) i7-7820HK CPU @ 2.90GHz  4core
  * memory: 16Gbyte 

* Benchmark code:  
  * fibonacci:  
  * binary-search: 


<font color="GoldenRod">Yellow color: Node.js</font>

<font color="CadetBlue">Blue color: cristal-nodejs</font>

```chart
{
  "type": "bar",
  "data": {
  "labels": [
    "fibonacci.js",
    "fibonacci.cr",
    "binarysearch.js",
    "binarysearch.cr"
  ],
  "datasets": [
    {
    "label": "Benchmark result(average time)",
    "data": [
      147.2058,
      147.2322,
      94.1126,
      94.1428 
    ],
    "backgroundColor": [
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)"
    ],
    "borderColor": [
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)"
    ],
    "borderWidth": 1
    }
  ]
  },
  "options": {}
}
```

##### Raw data(Benchmark result)

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

## Tips


## Contributing

1. Fork it (<https://github.com/fukaoi/crystal-nodejs/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [fukaoi](https://github.com/fukaoi) - creator and maintainer
