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

## Usage

```crystal
require "nodejs"
```

TODO: Write usage instructions here

## Development

TODO: Write development instructions here


## Benchmark


```chart
{
  "type": "bar",
  "data": {
  "labels": [
    "fibonacci(Node)",
    "fibonacci(crystal-nodejs)",
    "bi-search(Node)",
    "bi-search(crystal-nodejs)"
  ],
  "datasets": [
    {
    "label": "# of execution time(sec)",
    "data": [
      147.2058,
      147.2322,
      10,
      5
    ],
    "backgroundColor": [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)"
    ],
    "borderColor": [
      "rgba(255,99,132,1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255,99,132,1)",
      "rgba(54, 162, 235, 1)"
    ],
    "borderWidth": 1
    }
  ]
  },
  "options": {}
}
```

## Contributing

1. Fork it (<https://github.com/fukaoi/crystal-nodejs/fork>)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request

## Contributors

- [fukaoi](https://github.com/fukaoi) - creator and maintainer
