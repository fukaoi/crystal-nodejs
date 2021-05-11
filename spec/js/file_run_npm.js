const math = require('mathjs'); 

math.round(math.e, 3)            // 2.718
math.atan2(3, -3) / math.pi      // 0.75
math.log(10000, 10)              // 4
math.sqrt(-4)                    // 2i
math.derivative('x^2 + x', 'x')  // 2*x+1
math.pow([[-1, 2], [3, 1]], 2)
     // [[7, 0], [0, 7]]

// expressions
math.evaluate('1.2 * (2 + 4.5)')     // 7.8
math.evaluate('12.7 cm to inch')     // 5 inch
math.evaluate('sin(45 deg) ^ 2')     // 0.5
math.evaluate('9 / 3 + 2i')          // 3 + 2i
math.evaluate('det([-1, 2; 3, 1])')  // -7

// chaining
const res = math.chain(3)
    .add(4)
    .multiply(2)
    .done() // 14

toCrystal({result: res});
