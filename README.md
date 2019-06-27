# crystal-nodejs

Node.js engine for crystal-lang. JS code and npm module executes on crystal-nodejs, And don't need to install node.js binary.Explain about architecture, Compiled as a shared object node.js(i.e: libnodejs) and execute as one process on crystal-lang. So call C execvp() system call through Process.run() method, execute in this c function.

Process.run method is low overhead, Compare pure node.js js code and crystal-nodejs js code, There was no difference in performance(see Benchmark heading  about performance detail).

Using crystal-nodejs can pass through  node.js result of crystal-lang.

Happy Crystaling!! :tada:

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

##### How to send node.js result to crystal-lang

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
