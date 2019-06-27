# crystal-nodejs

Node.js engine for crystal-lang.  JS code and npm module executes on crystal-nodejs, AND don't need to install node.js binary. 

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

## Instructures

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
