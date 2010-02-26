// Scheme numbers.

if (! this['plt']) {
    this['plt'] = {};
}

if (! this['plt']['lib']) {
    this['plt']['lib'] = {};
}

if (! this['plt']['lib']['Numbers']) {
    this['plt']['lib']['Numbers'] = {};
}



(function() {
    // Abbreviation
    var Numbers = plt.lib.Numbers;



    // addLifts: (scheme-number scheme-number -> any) -> (scheme-number scheme-number) X
    // Applies a binary function, ensuring that both scheme numbers are
    // lifted to the same level.
    var addLifts = function(binaryFunction) {
	return function(x, y) {
	    if (typeof(x) === 'number' &&
		typeof(y) === 'number') {
		return binaryFunction(x, y);
	    }
	    if (typeof(x) === 'number') {
		x = Rational.makeInstance(x);
	    }
	    if (typeof(y) === 'number') {
		y = Rational.makeInstance(y);
	    }

	    if (x._level < y._level) x = x._lift(y);
	    if (y._level < x._level) y = y._lift(x);
	    return binaryFunction(x, y);
	}
    }


    // throwRuntimeError: string -> void
    // Throws a runtime error with the given message string.
    // Override this if you need to do something special.
    Numbers.throwRuntimeError = function(msg) {
	throw new Error(msg);
    }


    // isSchemeNumber: any -> boolean
    // Returns true if the thing is a scheme number.
    Numbers.isSchemeNumber = function(thing) {
	return (typeof(thing) === 'number'
		|| (thing !== undefined &&
		    thing !== null &&
		    (thing instanceof Rational ||
		     thing instanceof FloatPoint ||
		     thing instanceof Complex)));
    }

    // isFinite: scheme-number -> boolean
    Numbers.isFinite = function(n) {	
	return typeof(n) === 'number' || n.isFinite();
    };

    Numbers.isRational = function(n) {
	return typeof(n) === 'number' || n.isRational();
    };

    Numbers.isReal = function(n) {
	return typeof(n) === 'number' || n.isReal();
    };

    Numbers.isExact = function(n) {
	return typeof(n) === 'number' || n.isExact();
    }

    // isInteger: scheme-number -> boolean
    Numbers.isInteger = function(n) { 
	return typeof(n) === 'number' || n.isInteger();
    };

    // toFixnum: scheme-number -> javascript-number
    Numbers.toFixnum = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.toFixnum();
    };
 

    // toExact: scheme-number -> scheme-number
    Numbers.toExact = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.toExact();
    };

    // toComplex: scheme-number -> scheme-number
    Numbers.toComplex = function(n) {
	if (typeof(n) === 'number') {
	    return Complex.makeInstance(n, 0);
	}
	return Complex.makeInstance(Numbers.realPart(n),
				    Numbers.imaginaryPart(n));
    }


    //////////////////////////////////////////////////////////////////////


    // add: scheme-number scheme-number -> scheme-number
    Numbers.add = addLifts(function(x, y) {
	if (typeof(x) === 'number') {
	    var sum = x + y;
	    if (isOverflow(sum)) {
		return Rational.makeInstance(x).add(Rational.makeInstance(y));
	    } else {
		return sum;
	    }
	}
	return x.add(y);
    });

    // subtract: scheme-number scheme-number -> scheme-number
    Numbers.subtract = addLifts(function(x, y) {
	if (typeof(x) === 'number') {
	    var diff = x - y;
	    if (isOverflow(diff)) {
		return Rational.makeInstance(x).subtract(Rational.makeInstance(y));
	    } else {
		return diff;
	    }
	}
	return x.subtract(y);
    });
    
    // mulitply: scheme-number scheme-number -> scheme-number
    Numbers.multiply = addLifts(function(x, y) {
	if (typeof(x) === 'number') {
	    var prod = x * y;
	    if (isOverflow(prod)) {
		return Rational.makeInstance(x).multiply(Rational.makeInstance(y));
	    } else {
		return prod;
	    }
	}
	return x.multiply(y);
    });
    
    // divide: scheme-number scheme-number -> scheme-number
    Numbers.divide = addLifts(function(x, y) {
	if (typeof(x) === 'number') {
	    if (y === 0)
		Numbers.throwRuntimeError("division by zero");
	    var div = x / y;
	    if (isOverflow(div)) {
		return Rational.makeInstance(x).divide(Rational.makeInstance(y));
	    } else if (Math.floor(div) !== div) {
		return Rational.makeInstance(x, y);
	    } else {
		return div;
	    }
	}
	return x.divide(y);
    });
    
    // equals: scheme-number scheme-number -> boolean
    Numbers.equals = addLifts(function(x, y) {
	if (typeof(x) === 'number') {
	    return x === y;
	}
	return x.equals(y);
    });

    // eqv: scheme-number scheme-number -> boolean
    Numbers.eqv = function(x, y) {
	if (typeof(x) === 'number') {
	    return x === y;
	}
	return ((x === y) ||
		(x._level === y._level && 
		 x.eqv(y)));
    };

    // approxEqual: scheme-number scheme-number scheme-number -> boolean
    Numbers.approxEqual = function(x, y, delta) {
	return Numbers.lessThan(Numbers.abs(Numbers.subtract(x, y)),
                                delta);
    };
    
    // greaterThanOrEqual: scheme-number scheme-number -> boolean
    Numbers.greaterThanOrEqual = addLifts(function(x, y){
	if (typeof(x) === 'number') {
	    return x >= y;
	}
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError(
		"greaterThanOrEqual: couldn't be applied to complex number");
	return x.greaterThanOrEqual(y);
    });
 
    // lessThanOrEqual: scheme-number scheme-number -> boolean
    Numbers.lessThanOrEqual = addLifts(function(x, y){
	if (typeof(x) === 'number') {
	    return x <= y;
	}
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("lessThanOrEqual: couldn't be applied to complex number");
	return x.lessThanOrEqual(y);    	
    });

    // greaterThan: scheme-number scheme-number -> boolean
    Numbers.greaterThan = addLifts(function(x, y){
	if (typeof(x) === 'number') {
	    return x > y;
	}
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("greaterThan: couldn't be applied to complex number");
	return x.greaterThan(y);	
    });
    
    // lessThan: scheme-number scheme-number -> boolean
    Numbers.lessThan = addLifts(function(x, y){
	if (typeof(x) === 'number') {
	    return x < y;
	}
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("lessThan: couldn't be applied to complex number");
	return x.lessThan(y);
    });
    
    // expt: scheme-number scheme-number -> scheme-number
    Numbers.expt = addLifts(function(x, y){
	if (typeof(x) === 'number') {
	    if (y >= 0) {
		var pow = Math.pow(x, y);
		if (isOverflow(pow)) {
		    return Rational.makeInstance(x).expt(Rational.makeInstance(y));
		} else {
		    return pow;
		}
	    } else {
		return Rational.makeInstance(x).expt(Rational.makeInstance(y));
	    }
	}
	return x.expt(y);
    });
    

    // modulo: scheme-number scheme-number -> scheme-number
    Numbers.modulo = function(m, n) {
	var result;
	if (typeof(m) === 'number') {
	    result = m % n;
	    if (n < 0) {
		if (result <= 0)
		    return result;
		else
		    return result + n;
	    } else {
		if (result < 0)
		    return result + n;
		else
		    return result;
	    }
	}
	result = Rational.makeInstance(m.toFixnum() % n.toFixnum());
	// The sign of the result should match the sign of n.
	if (Numbers.lessThan(n, Rational.ZERO)) {
	    if (Numbers.lessThanOrEqual(result, Rational.ZERO)) {
		return result;
	    }
	    return Numbers.add(result, n);

	} else {
	    if (Numbers.lessThan(result, Rational.ZERO)) {
		return Numbers.add(result, n);
	    }
	    return result;
	}
    };
 
    Numbers.numerator = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.numerator();
    };


    Numbers.denominator = function(n) {
	if (typeof(n) === 'number')
	    return 1;
	return n.denominator();
    };

    Numbers.sqrt = function(n) {
	if (typeof(n) === 'number') {
	    if (n >= 0) {
		var result = Math.sqrt(n);
		if (Math.floor(result) === result) {
		    return result;
		} else {
		    return FloatPoint.makeInstance(result);
		}
	    } else {
		return Rational.makeInstance(n).sqrt();		
	    }
	}
	return n.sqrt();
    }

    // abs: scheme-number -> scheme-number
    Numbers.abs = function(n) {
	if (typeof(n) === 'number') {
	    return Math.abs(n);
	}
	return n.abs();
    };
    
    Numbers.floor = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.floor();
    };

    Numbers.ceiling = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.ceiling();
    };

    Numbers.conjugate = function(n) {
	if (typeof(n) === 'number')
	    return n;
	return n.conjugate();
    };

    Numbers.magnitude = function(n) {
	if (typeof(n) === 'number')
	    return Math.abs(n);
	return n.magnitude();
    };

    Numbers.log = function(n) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).log();
	}
	return n.log();
    }

    Numbers.angle = function(n) {
	if (typeof(n) === 'number') {
	    if (n > 0)
		return Rational.ZERO;
	    else
		return FloatPoint.pi;
	}
	return n.angle();
    };

    Numbers.atan = function(n) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).atan();
	}
	return n.atan();
    };

    // cos: scheme-number -> scheme-number
    Numbers.cos = function(n) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).cos();
	}
	return n.cos();
    };

    Numbers.sin = function(n) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).sin();
	}
	return n.sin();
    };

    Numbers.acos = function(n) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).acos();
	}
	return n.acos();
    };

    Numbers.asin = function(n) {
	if (typeof(n) === 'number') {
	    return Rational.makeInstance(n).asin();
	}
	return n.asin();
    }

    Numbers.imaginaryPart = function(n) {
	if (typeof(n) === 'number') {
	    return 0;
	}
	return n.imaginaryPart();
    }

    Numbers.realPart = function(n) {
	if (typeof(n) === 'number') {
	    return n;
	}
	return n.realPart();
    }

    Numbers.round = function(n) {
	if (typeof(n) === 'number') {
	    return n;
	}
	return n.round();
    }


    // exp: scheme-number -> scheme-number
    Numbers.exp = function(x) {
	if (typeof(n) === 'number') {
	    // FIXME: do something faster
	    return Rational.makeInstance(n).exp();
	}
	return x.exp();
    };


    // sqr: scheme-number -> scheme-number
    Numbers.sqr = function(x) {
	return Numbers.multiply(x, x);
    };

    
    // integerSqrt: scheme-number -> scheme-number
    Numbers.integerSqrt = function(x) {
	var result = Numbers.sqrt(x);
	if (Numbers.isRational(result)) {
	    return Rational.makeInstance(Numbers.toFixnum(result));
	} else if (Numbers.isReal(result)) {
	    return Rational.makeInstance(Numbers.toFixnum(result));
	} else {
	    // it must be complex.
	    return Complex.makeInstance(
		Rational.makeInstance
		(Numbers.toFixnum(Numbers.realPart(result))),
		Rational.makeInstance
		(Numbers.toFixnum(Numbers.imaginaryPart(result))));
	}
    };


    // gcd: scheme-number [scheme-number ...] -> scheme-number
    Numbers.gcd = function(first, rest) {
	// FIXME: check that all values are integral
	var result = Math.abs(Numbers.toFixnum(first));
	for (var i = 0; i < rest.length; i++) {
	    result = _gcd(result, Numbers.toFixnum(rest[i]));
	}
	return Rational.makeInstance(result);	
    };

    // lcm: scheme-number [scheme-number ...] -> scheme-number
    Numbers.lcm = function(first, rest) {
	// FIXME: check that all values are integral
	var result = Math.abs(Numbers.toFixnum(first));
	if (result === 0) { return Rational.ZERO; }
	for (var i = 0; i < rest.length; i++) {
	    if (Numbers.toFixnum(rest[i]) === 0) {
		return Rational.ZERO;
	    }
	    result = _lcm(result, rest[i].toFixnum());
	}
	return Rational.makeInstance(result);
    };



    // toString: scheme-number -> string
    Numbers.toString = function(x) {
	return x.toString();
    }



    //////////////////////////////////////////////////////////////////////

    // Helpers


    // isOverflow: javascript-number -> boolean
    // Returns true if we consider the number an overflow.
    var MIN_FIXNUM = -9e15;
    var MAX_FIXNUM = 9e15;
    var isOverflow = function(n) {
	return (MIN_FIXNUM < n || n > MAX_FIXNUM);
    };


    // negate: scheme-number -> scheme-number
    // multiplies a number times -1.
    var negate = function(n) {
	return Numbers.multiply(
	    n,
	    Rational.makeInstance(-1));
    };

    // halve: scheme-number -> scheme-number
    // Divide a number by 2.
    var halve = function(n) {
	return Numbers.multiply(
	    n,
	    Rational.makeInstance(1, 2));
    };


    // timesI: scheme-number scheme-number
    // multiplies a number times i.
    var timesI = function(x) {
	return Numbers.multiply(
	    x,
	    Complex.makeInstance(Rational.ZERO, Rational.ONE));
    };


    // gcd: javascript-number javascript-number -> javascript-number
    var gcd = function(a, b) {
	var t;
	if (isNaN(a) || !isFinite(a)) {
	    Numbers.throwRuntimeError("not a number: " + a);
	}
	if (isNaN(b) || !isFinite(b)) {
	    Numbers.throwRuntimeError("not a number: " + b);
	}
	while (b !== 0) {
	    t = a;
	    a = b;
	    b = t % b;
	}
	return a;
    };



    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////
    // The boxed number types are expected to implement the following 
    // interface.
    //
    // toString: -> string

    // _level: number

    // _lift: scheme-number -> scheme-number

    // isFinite: -> boolean 

    // isInteger: -> boolean
    // Produce true if this number can be coersed into an integer.
    
    // isRational: -> boolean
    // Produce true if the number is rational.

    // isReal: -> boolean
    // Produce true if the number is real.
    
    // isExact: -> boolean
    // Produce true if the number is exact

    // toExact: -> scheme-number
    // Produce an exact number.

    // toFixnum: -> javascript-number
    // Produce a javascript number.
    
    // greaterThan: scheme-number -> boolean
    // Compare against instance of the same type.

    // greaterThanOrEqual: scheme-number -> boolean
    // Compare against instance of the same type.

    // lessThan: scheme-number -> boolean
    // Compare against instance of the same type.

    // lessThanOrEqual: scheme-number -> boolean
    // Compare against instance of the same type.

    // add: scheme-number -> scheme-number
    // Add with an instance of the same type.
    
    // subtract: scheme-number -> scheme-number
    // Subtract with an instance of the same type.

    // multiply: scheme-number -> scheme-number
    // Multiply with an instance of the same type.

    // divide: scheme-number -> scheme-number
    // Divide with an instance of the same type.

    // numerator: -> scheme-number
    // Return the numerator.

    // denominator: -> scheme-number
    // Return the denominator.

    // sqrt: -> scheme-number
    // Produce the square root.

    // abs: -> scheme-number
    // Produce the absolute value.

    // floor: -> scheme-number
    // Produce the floor.

    // ceiling: -> scheme-number
    // Produce the ceiling.

    // conjugate: -> scheme-number
    // Produce the conjugate.
    
    // magnitude: -> scheme-number
    // Produce the magnitude.

    // log: -> scheme-number
    // Produce the log.

    // angle: -> scheme-number
    // Produce the angle.

    // atan: -> scheme-number
    // Produce the arc tangent.

    // cos: -> scheme-number
    // Produce the cosine.

    // sin: -> scheme-number
    // Produce the sine.

    // expt: scheme-number -> scheme-number
    // Produce the power to the input.

    // exp: -> scheme-number
    // Produce the power to e.
    
    // acos: -> scheme-number
    // Produce the arc cosine.

    // asin: -> scheme-number
    // Produce the arc sine.

    // imaginaryPart: -> scheme-number
    // Produce the imaginary part
    
    // realPart: -> scheme-number
    // Produce the real part.

    // round: -> scheme-number
    // Round to the nearest integer.

    // equals: scheme-number -> boolean
    // Produce true if the given number of the same type is equal.

    // eqv: scheme-number -> boolean
    // Produce true if the given number of the same type is equivalent.



    //////////////////////////////////////////////////////////////////////

    // Rationals
    
    
    var Rational = function(n, d) {
	if (d === undefined) { d = 1; }
	if (d === 0) {
	    Numbers.throwRuntimeError("cannot have zero denominator.");
	}
	var divisor = gcd(Math.abs(n), Math.abs(d));
	this.n = n / divisor;
	this.d = d / divisor;
    };

    
    Rational.prototype.toString = function() {
	if (this.d === 1) {
	    return this.n + "";
	} else {
	    return this.n + "/" + this.d;
	}
    };

    
    Rational.prototype._level = function() {
	return 0;
    };
    
    
    Rational.prototype._lift = function(target) {
	if (target._level === 1)
	    return FloatPoint.makeInstance(this.n / this.d);
	if (target._level === 2)	
	    return Complex.makeInstance(this, 
					Rational.ZERO);
	Numbers.throwRuntimeError("invalid _level of Number");
    };
    
    Rational.prototype.isFinite = function() {
	return true;
    };

    Rational.prototype.equals = function(other) {
	return other instanceof Rational &&
	    this.n === other.n &&
	    this.d === other.d;
    };

    Rational.prototype.eqv = function(other) {
	return other instanceof Rational &&
	    this.n === other.n &&
	    this.d === other.d;
    };


    Rational.prototype.isInteger = function() { 
	return this.d === 1;
    }
    
    Rational.prototype.isRational = function() {
        return true;
    };
    
    Rational.prototype.isReal = function() {
	return true;
    };

    
    Rational.prototype.add = function(other) {
	return Rational.makeInstance(this.n * other.d + 
				     this.d * other.n,
				     this.d * other.d);
    };
    
    Rational.prototype.subtract = function(other) {
	return Rational.makeInstance((this.n * other.d) - 
				     (this.d * other.n),
				     (this.d * other.d));
    };
    
    Rational.prototype.multiply = function(other) {
	return Rational.makeInstance(this.n * other.n,
				     this.d * other.d);
    };
    
    Rational.prototype.divide = function(other) {
	if (this.d * other.n === 0) {
	    Numbers.throwRuntimeError("division by zero");
	}
	return Rational.makeInstance(this.n * other.d,
				     this.d * other.n);
    };
    

    Rational.prototype.toExact = function() { 
	return this;
    };

    Rational.prototype.isExact = function() {
        return true;
    };
    
    Rational.prototype.toFixnum = function() {
	return Math.floor(this.n / this.d);  
    };

    Rational.prototype.numerator = function() {
	return Rational.makeInstance(this.n);
    };

    Rational.prototype.denominator = function() {
	return Rational.makeInstance(this.d);
    };
        
    Rational.prototype.greaterThan = function(other) {
	return this.n*other.d > this.d*other.n;
    };

    Rational.prototype.greaterThanOrEqual = function(other) {
	return this.n*other.d >= this.d*other.n;
    };
    
    Rational.prototype.lessThan = function(other) {
	return this.n*other.d < this.d*other.n;
    };

    Rational.prototype.lessThanOrEqual = function(other) {
	return this.n*other.d <= this.d*other.n;
    };

    
    Rational.prototype.sqrt = function() {
	if (this.n >= 0) {
	    var newN = Math.sqrt(this.n);
	    var newD = Math.sqrt(this.d);
	    if (Math.floor(newN) === newN &&
		Math.floor(newD) === newD) {
		return Rational.makeInstance(newN, newD);
	    } else {
		return FloatPoint.makeInstance(newN / newD);
	    }
	} else {
	    var newN = Math.sqrt(- this.n);
	    var newD = Math.sqrt(this.d);
	    if (Math.floor(newN) === newN &&
		Math.floor(newD) === newD) {
		return Complex.makeInstance(
		    Rational.ZERO,
		    Rational.makeInstance(newN, newD));
	    } else {
		return Complex.makeInstance(
		    Rational.ZERO,
		    FloatPoint.makeInstance(newN / newD));
	    }
	}
    };
    
    Rational.prototype.abs = function() {
	return Rational.makeInstance(Math.abs(this.n),
				     this.d);
    };
    
    Rational.prototype.floor = function() {
	return Rational.makeInstance(Math.floor(this.n / this.d), 1);
    };
    
    
    Rational.prototype.ceiling = function() {
	return Rational.makeInstance(Math.ceil(this.n / this.d), 1);
    };
    
    Rational.prototype.conjugate = function() {
	return this;
    }
    
    Rational.prototype.magnitude = Rational.prototype.abs;
    
    Rational.prototype.log = function(){
	return FloatPoint.makeInstance(Math.log(this.n / this.d));
    };
    
    Rational.prototype.angle = function(){
	if (0 === this.n)
	    return Rational.ZERO;
	if (this.n > 0)
	    return Rational.ZERO;
	else
	    return FloatPoint.pi;
    };
    
    Rational.prototype.atan = function(){
	return FloatPoint.makeInstance(Math.atan(this.n / this.d));
    };
    
    Rational.prototype.cos = function(){
	return FloatPoint.makeInstance(Math.cos(this.n / this.d));
    };
    
    Rational.prototype.sin = function(){
	return FloatPoint.makeInstance(Math.sin(this.n / this.d));
    };
    
    Rational.prototype.expt = function(a){
	return FloatPoint.makeInstance(Math.pow(this.n / this.d, a.n / a.d));
    };
    
    Rational.prototype.exp = function(){
	return FloatPoint.makeInstance(Math.exp(this.n / this.d));
    };
    
    Rational.prototype.acos = function(){
	return FloatPoint.makeInstance(Math.acos(this.n / this.d));
    };
    
    Rational.prototype.asin = function(){
	return FloatPoint.makeInstance(Math.asin(this.n / this.d));
    };
    
    Rational.prototype.imaginaryPart = function(){
	return Rational.ZERO;
    };
    
    Rational.prototype.realPart = function(){
	return this;
    };

    
    Rational.prototype.round = function() {
	if (this.d === 2) {
	    // Round to even if it's a n/2
	    var v = this.n / this.d;
	    var fl = Math.floor(v);
	    var ce = Math.ceil(v);
	    if (fl % 2 === 0) { 
		return Rational.makeInstance(fl); 
	    }
	    else { 
		return Rational.makeInstance(ce); 
	    }
	} else {
	    return Rational.makeInstance(Math.round(this.n / this.d));
	}
    };
    
        
    
    var _rationalCache = {};
    Rational.makeInstance = function(n, d) {
	if (n === undefined)
	    Numbers.throwRuntimeError("n undefined");

	if (d === undefined) { d = 1; }
	
	if (d < 0) {
	    n = -n;
	    d = -d;
	}

	// Defensive edge cases.  We should never hit these
	// cases, but since we don't yet have bignum arithmetic,
	// it's possible that we may pass bad arguments to
	// Integer.makeInstance.
	if (isNaN (n) || isNaN(d)) {
	    return FloatPoint.nan;
	}
	if (! isFinite(d)) {
	    return Rational.ZERO;
	}
	if (! isFinite(n)) {
	    return FloatPoint.makeInstance(n);
	}


	if (d === 1 && n in _rationalCache) {
	    return _rationalCache[n];
	}
	else {
	    return new Rational(n, d);
	}
    };
    
    _rationalCache = {};
    (function() {
	var i;
	for(i = -500; i < 500; i++) {
	    _rationalCache[i] = new Rational(i, 1);
	}
    })();
    Rational.NEGATIVE_ONE = _rationalCache[-1];
    Rational.ZERO = _rationalCache[0];
    Rational.ONE = _rationalCache[1];
    Rational.TWO = _rationalCache[2];



    // Floating Point numbers
    var FloatPoint = function(n) {
	this.n = n;
    };
    FloatPoint = FloatPoint;


    var NaN = new FloatPoint(Number.NaN);
    var inf = new FloatPoint(Number.POSITIVE_INFINITY);
    var neginf = new FloatPoint(Number.NEGATIVE_INFINITY);

    FloatPoint.pi = new FloatPoint(Math.PI);
    FloatPoint.e = new FloatPoint(Math.E);
    FloatPoint.nan = NaN;
    FloatPoint.inf = inf;
    FloatPoint.neginf = neginf;

    FloatPoint.makeInstance = function(n) {
	if (isNaN(n)) {
	    return FloatPoint.nan;
	} else if (n === Number.POSITIVE_INFINITY) {
	    return FloatPoint.inf;
	} else if (n === Number.NEGATIVE_INFINITY) {
	    return FloatPoint.neginf;
	}
	return new FloatPoint(n);
    };



    FloatPoint.prototype.isFinite = function() {
	return isFinite(this.n);
    };


    FloatPoint.prototype.toExact = function() {
	return Rational.makeInstance(Math.floor(this.n), 1);
    };

    FloatPoint.prototype.isExact = function() {
	return false;
    };


    FloatPoint.prototype._level = function() {
	return 1;
    };
    
    FloatPoint.prototype._lift = function(target) {
	return Complex.makeInstance(this, Rational.ZERO);
    };
    
    FloatPoint.prototype.toString = function() {
	if (this.n === Number.POSITIVE_INFINITY) {
	    return "+inf.0";
	} else if (this.n === Number.NEGATIVE_INFINITY) {
	    return "-inf.0";
	} else if (this.n === Number.NaN) {
	    return "+nan.0";
	} else {
	    return this.n.toString();
	}
    };
    

    FloatPoint.prototype.equals = function(other, aUnionFind) {
	return ((other instanceof FloatPoint) &&
		((this.n === other.n)));
    };

    FloatPoint.prototype.eqv = function(other, aUnionFind) {
	return ((other instanceof FloatPoint) &&
		((this.n === other.n) ||
		 (isNaN(this.n) && isNaN(other.n))));
    };


    FloatPoint.prototype.isRational = function() {
        return this.isFinite() && this.n === Math.floor(this.n);
    };

    FloatPoint.prototype.isInteger = function() {
	return this.isFinite() && this.n === Math.floor(this.n);
    };

    FloatPoint.prototype.isReal = function() {
	return true;
    };
    

    // sign: Number -> {-1, 0, 1}
    var sign = function(n) {
	if (Numbers.lessThan(n, Rational.ZERO)) {
	    return -1;
	} else if (Numbers.greaterThan(n, Rational.ZERO)) {
	    return 1;
	} else {
	    return 0;
	}
    };


    FloatPoint.prototype.add = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n + other.n);
	} else {
	    if (isNaN(this.n) || isNaN(other.n)) {
		return NaN;
	    } else if (this.isFinite() && ! other.isFinite()) {
		return other;
	    } else if (!this.isFinite() && other.isFinite()) {
		return this;
	    } else {
		return ((sign(this) * sign(other) === 1) ?
			this : NaN);
	    };
	}
    };
    
    FloatPoint.prototype.subtract = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n - other.n);
	} else if (isNaN(this.n) || isNaN(other.n)) {
	    return NaN;
	} else if (! this.isFinite() && ! other.isFinite()) {
	    if (sign(this) === sign(other)) {
		return NaN;
	    } else {
		return this;
	    }
	} else if (this.isFinite()) {
	    return Numbers.multiply(other, Rational.NEGATIVE_ONE);
	} else {  // other.isFinite()
	    return this;
	}

    };
    
    FloatPoint.prototype.multiply = function(other) {
	if (this.n === 0 || other.n === 0) { return Rational.ZERO; }

	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n * other.n);
	} else if (isNaN(this.n) || isNaN(other.n)) {
	    return NaN;
	} else {
	    return ((sign(this) * sign(other) === 1) ? inf : neginf);
	}
    };
    
    FloatPoint.prototype.divide = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    if (other.n === 0) {
		Numbers.throwRuntimeError("division by zero");
	    }
            return FloatPoint.makeInstance(this.n / other.n);
	} else if (isNaN(this.n) || isNaN(other.n)) {
	    return NaN;
	} else if (! this.isFinite() && !other.isFinite()) {
	    return NaN;
	} else if (this.isFinite() && !other.isFinite()) {
	    return FloatPoint.makeInstance(0.0);
	} else if (! this.isFinite() && other.isFinite()) {
	    return ((sign(this) * sign(other) === 1) ? inf : neginf);
	}

    };
    
    
    FloatPoint.prototype.toFixnum = function() {
	return Math.floor(this.n);  
    };
    
    FloatPoint.prototype.numerator = function() {
	var stringRep = this.n.toString();
	var match = stringRep.match(/^(.*)\.(.*)$/);
	if (match) {
	    return FloatPoint.makeInstance(parseFloat(match[1] + match[2]));
	} else {
	    return this;
	}
    };

    FloatPoint.prototype.denominator = function() {
	var stringRep = this.n.toString();
	var match = stringRep.match(/^(.*)\.(.*)$/);
	if (match) {
	    return FloatPoint.makeInstance(Math.pow(10, match[2].length));
	} else {
	    return FloatPoint.makeInstance(1.0);
	}
    };

    
    FloatPoint.prototype.floor = function() {
	if (! isFinite(this.n)) {
	    return this;
	}
	return Rational.makeInstance(Math.floor(this.n), 1);
    };
    
    FloatPoint.prototype.ceiling = function() {
	if (! isFinite(this.n)) {
	    return this;
	}
	return Rational.makeInstance(Math.ceil(this.n), 1);
    };
    


    FloatPoint.prototype.greaterThan = function(other) {
	return this.n > other.n;
    };
    
    FloatPoint.prototype.greaterThanOrEqual = function(other) {
	return this.n >= other.n;
    };
    
    FloatPoint.prototype.lessThan = function(other) {
	return this.n < other.n;
    };
    
    FloatPoint.prototype.lessThanOrEqual = function(other) {
	return this.n <= other.n;
    };

    
    FloatPoint.prototype.sqrt = function() {
	if (this.n < 0) {
	    var result = Complex.makeInstance(
		Rational.ZERO,
		FloatPoint.makeInstance(Math.sqrt(-this.n)));
	    return result;
	} else {
	    return FloatPoint.makeInstance(Math.sqrt(this.n));
	}
    };
    
    FloatPoint.prototype.abs = function() {
	return FloatPoint.makeInstance(Math.abs(this.n));
    };
    

    
    FloatPoint.prototype.log = function(){
	if (this.n < 0)
	    return Numbers.log(Numbers.toComplex(this));
	else
	    return FloatPoint.makeInstance(Math.log(this.n));
    };
    
    FloatPoint.prototype.angle = function(){
	if (0 === this.n)
	    return Rational.ZERO;
	if (this.n > 0)
	    return Rational.ZERO;
	else
	    return FloatPoint.pi;
    };
    
    FloatPoint.prototype.atan = function(){
	return FloatPoint.makeInstance(Math.atan(this.n));
    };
    
    FloatPoint.prototype.cos = function(){
	return FloatPoint.makeInstance(Math.cos(this.n));
    };
    
    FloatPoint.prototype.sin = function(){
	return FloatPoint.makeInstance(Math.sin(this.n));
    };
    
    FloatPoint.prototype.expt = function(a){
	if (this.n === 1) {
	    if (a.isFinite()) {
		return this;
	    } else if (isNaN(a.n)){
		return this;
	    } else {
		return this;
	    }
	} else {
	    return FloatPoint.makeInstance(Math.pow(this.n, a.n));
	}
    };
    
    FloatPoint.prototype.exp = function(){
	return FloatPoint.makeInstance(Math.exp(this.n));
    };
    
    FloatPoint.prototype.acos = function(){
	return FloatPoint.makeInstance(Math.acos(this.n));
    };
    
    FloatPoint.prototype.asin = function(){
	return FloatPoint.makeInstance(Math.asin(this.n));
    };
    
    FloatPoint.prototype.imaginaryPart = function(){
	return Rational.ZERO;
    };
    
    FloatPoint.prototype.realPart = function(){
	return this;
    };
    
    
    FloatPoint.prototype.round = function(){
	if (isFinite(this.n)) {
	    if (Math.abs(Math.floor(this.n) - this.n) === 0.5) {
		if (Math.floor(this.n) % 2 === 0)
		    return Rational.makeInstance(Math.floor(this.n));
		return Rational.makeInstance(Math.ceil(this.n));
	    } else {
		return Rational.makeInstance(Math.round(this.n));
	    }
	} else {
	    return this;
	}	
    };
    
    
    FloatPoint.prototype.conjugate = function() {
	return this;
    };
    
    FloatPoint.prototype.magnitude = FloatPoint.prototype.abs;
    


    //////////////////////////////////////////////////////////////////////
    // Complex numbers
    //////////////////////////////////////////////////////////////////////    
    
    var Complex = function(r, i){
	this.r = r;
	this.i = i;
    };
    
    // Constructs a complex number from two basic number r and i.  r and i can
    // either be plt.type.Rational or plt.type.FloatPoint.
    Complex.makeInstance = function(r, i){
	if (typeof(r) === 'number') {
	    r = (r === Math.floor(r) ? Rational.makeInstance(r) :
		 FloatPoint.makeInstance(r));
	}
	if (typeof(i) === 'number') {
	    i = (i === Math.floor(i) ? Rational.makeInstance(i) :
		 FloatPoint.makeInstance(i));
	}

	var result = new Complex(r, i);
	return result;
    };
    
    Complex.prototype.toString = function() {
	if (Numbers.greaterThanOrEqual(
	    this.i,
	    Rational.ZERO)) {
            return toString(this.r) + "+" + toString(this.i)+"i";
	} else {
            return toString(this.r) + toString(this.i)+"i";
	}
    };



    Complex.prototype.isFinite = function() {
	return this.r.isFinite() && this.i.isFinite();
    }


    Complex.prototype.isRational = function() {
	return this.r.isRational() && Numbers.equals(this.i, Rational.ZERO);
    };

    Complex.prototype.isInteger = function() {
	return (this.r.isInteger() && 
		Numbers.equals(this.i, Rational.ZERO));
    };

    Complex.prototype.toExact = function() { 
	if (! this.isReal()) {
	    Numbers.throwRuntimeError("inexact->exact: expects argument of type real number");
	}
	return this.r.toExact();
    };

    Complex.prototype.isExact = function() { 
        return this.r.isExact() && this.i.isExact();
    };



    Complex.prototype._level = 2;

    
    Complex.prototype._lift = function(target){
	Numbers.throwRuntimeError("Don't know how to lift Complex number");
    };
    
    Complex.prototype.equals = function(other) {
	var result = ((other instanceof Complex) && 
		      (Numbers.equals(this.r, other.r)) &&
		      (Numbers.equals(this.i, other.i)));
	return result;
    };

    Complex.prototype.eqv = function(other) {
	var result = ((other instanceof Complex) && 
		      (Numbers.equals(this.r, other.r)) &&
		      (Numbers.equals(this.i, other.i)));
	return result;
    };



    Complex.prototype.greaterThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError(">: expects argument of type real number");
	}
	return Numbers.greaterThan(this.r, other.r);
    };

    Complex.prototype.greaterThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError(">=: expects argument of type real number");
	}
	return Numbers.greaterThanOrEqual(this.r, other.r);
    };

    Complex.prototype.lessThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError("<: expects argument of type real number");
	}
	return Numbers.lessThan(this.r, other.r);
    };

    Complex.prototype.lessThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError("<=: expects argument of type real number");
	}
	return Numbers.lessThanOrEqual(this.r, other.r);
    };


    Complex.prototype.abs = function(){
	if (!Numbers.equals(this.i, Rational.ZERO).valueOf())
	    Numbers.throwRuntimeError("abs: expects argument of type real number");
	return this.r.abs();
    };
    
    Complex.prototype.toFixnum = function(){
	if (!Numbers.equals(this.i, Rational.ZERO).valueOf())
	    Numbers.throwRuntimeError("toFixnum: expects argument of type real number");
	return this.r.toFixnum();
    };

    Complex.prototype.numerator = function() {
	if (!this.isReal())
	    Numbers.throwRuntimeError("numerator: can only be applied to real number");
	return this.n.numerator();
    };
    

    Complex.prototype.denominator = function() {
	if (!this.isReal())
	    Numbers.throwRuntimeError("floor: can only be applied to real number");
	return this.n.denominator();
    };

    Complex.prototype.add = function(other){
	return Complex.makeInstance(
	    Numbers.add(this.r, other.r),
	    Numbers.add(this.i, other.i));
    };
    
    Complex.prototype.subtract = function(other){
	return Complex.makeInstance(
	    Numbers.subtract(this.r, other.r),
	    Numbers.subtract(this.i, other.i));
    };
    
    Complex.prototype.multiply = function(other){

	// If the other value is real, just do primitive division
	if (other.isReal()) {
	    return Complex.makeInstance(
		Numbers.multiply(this.r, other.r),
		Numbers.multiply(this.i, other.r));
	}

	var r = Numbers.subtract(
	    Numbers.multiply(this.r, other.r),
	    Numbers.multiply(this.i, other.i));
	var i = Numbers.add(
	    Numbers.multiply(this.r, other.i),
	    Numbers.multiply(this.i, other.r));
	if (Numbers.equals(i, Rational.ZERO)) {
	    return r;
	}
	return Complex.makeInstance(r, i);
    };
    
    Complex.prototype.divide = function(other){
	// If the other value is real, just do primitive division
	if (other.isReal()) {
	    return Complex.makeInstance(
		Numbers.divide(this.r, other.r),
		Numbers.divide(this.i, other.r));
	}


	var con = other.conjugate();
	var up = Numbers.toComplex(Numbers.multiply(this, con));

	// Down is guaranteed to be real by this point.
	var down = Numbers.multiply(other, con);

	var result = Complex.makeInstance(
	    Numbers.divide(up.r, down),
	    Numbers.divide(up.i, down));
	return result;
    };
    
    Complex.prototype.conjugate = function(){
	var result = Complex.makeInstance(
	    this.r, 
	    Numbers.subtract(Rational.ZERO, 
				 this.i));

	return result;
    };
    
    Complex.prototype.magnitude = function(){
	var sum = Numbers.add(
	    Numbers.multiply(this.r, this.r),
	    Numbers.multiply(this.i, this.i));
	return Numbers.sqrt(sum);
    };
    
    Complex.prototype.isReal = function(){
	return Numbers.equals(this.i, Rational.ZERO);
    };
    
    Complex.prototype.sqrt = function(){
	if (this.isReal())
	    return Numbers.sqrt(this.r);
	// http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers	
	var r_plus_x = Numbers.add(this.magnitude(), this.r);

	var r = Numbers.sqrt(halve(r_plus_x));

	var i = Numbers.divide(this.i, Numbers.multiply(r_plus_x, FloatPoint.makeInstance(2)).sqrt());
	

	return Complex.makeInstance(r, i);
    };
    
    Complex.prototype.log = function(){
	var m = this.magnitude();
	var theta = this.angle();
	var result = Numbers.add(
	    m.log(),
	    timesI(theta));
	return result;
    };
    
    Complex.prototype.angle = function(){
	if (this.isReal()) {
	    return this.r.angle();
	}
	if (Numbers.equals(Rational.ZERO, this.r)) {
	    var tmp = halve(FloatPoint.pi);
	    return Numbers.greaterThan(this.i, Rational.ZERO) ? 
		tmp : negate(tmp);
	} else {
	    var tmp = Numbers.divide(this.i.abs(), this.r.abs()).atan();
	    if (Numbers.greaterThan(this.r, Rational.ZERO)) {
		return Numbers.greaterThan(this.i, Rational.ZERO) ? 
		    tmp : negate(tmp);
	    } else {
		return Numbers.greaterThan(this.i, Rational.ZERO) ? 
		    FloatPoint.pi.subtract(tmp) : tmp.subtract(FloatPoint.pi);
	    }
	}
    };
    
    var plusI = Complex.makeInstance(Rational.ZERO,
				     Rational.ONE);
    var minusI = Complex.makeInstance(Rational.ZERO,
				      Rational.NEGATIVE_ONE);
    
    Complex.prototype.atan = function(){
	if (Numbers.equals(this, plusI) ||
	    Numbers.equals(this, minusI)) {
	    return FloatPoint.makeInstance(Number.NEGATIVE_INFINITY);
	}
	return Numbers.multiply(
	    plusI,
	    Numbers.multiply(
		FloatPoint.makeInstance(0.5),
		(Numbers.divide(
		    Numbers.add(plusI, this),
		    Numbers.add(
			plusI,
			Numbers.subtract(Rational.ZERO, this)))).log()));
    };
    
    Complex.prototype.cos = function(){
	if (this.isReal())
	    return Numbers.cos(this.r);
	var iz = timesI(this);
	var iz_negate = negate(iz);
	
	return halve(Numbers.add(iz.exp(), iz_negate.exp()));
    };
    
    Complex.prototype.sin = function(){
	if (this.isReal())
	    return this.r.sin();
	var iz = timesI(this);
	var iz_negate = negate(iz);
	var z2 = Complex.makeInstance(Rational.ZERO,
				      Rational.TWO);
	var exp_negate = Numbers.subtract(iz.exp(), iz_negate.exp());
	var result = Numbers.divide(exp_negate, z2);
	return result;
    };
    
    Complex.prototype.expt= function(y){
	var expo = Numbers.multiply(y, this.log());
	return expo.exp();
    };
    
    Complex.prototype.exp = function(){
	var r = this.r.exp();
	var cos_a = Numbers.cos(this.i);
	var sin_a = this.i.sin();

	return Numbers.multiply(
	    r,
	    Numbers.add(cos_a, timesI(sin_a)));
    };
    
    Complex.prototype.acos = function(){
	if (this.isReal())
	    return Numbers.acos(this.r);
	var pi_half = halve(FloatPoint.pi);
	var iz = timesI(this);
	var root = Numbers.sqrt(Numbers.subtract(Rational.ONE, Numbers.sqr(this)));
	var l = timesI(Numbers.log(Numbers.add(iz, root)));
	return Numbers.add(pi_half, l);
    };
    
    Complex.prototype.asin = function(){
	if (this.isReal())
	    return Numbers.asin(this.r);

	var oneNegateThisSq = 
	    Numbers.subtract(
		Rational.ONE, 
		this.multiply(this));
	var sqrtOneNegateThisSq = Numbers.sqrt(oneNegateThisSq);
	return Numbers.multiply(
	    Rational.TWO,
	    Numbers.atan(Numbers.divide(
		this, 
		Numbers.add(
		    Rational.ONE,
		    sqrtOneNegateThisSq))));
    };
    
    Complex.prototype.ceiling = function(){
	if (!this.isReal())
	    Numbers.throwRuntimeError("ceiling: can only be applied to real number");
	return this.r.ceiling();
    };
    
    Complex.prototype.floor = function(){
	if (!this.isReal())
	    Numbers.throwRuntimeError("floor: can only be applied to real number");
	return this.r.floor();
    };
    
    Complex.prototype.imaginaryPart = function(){
	return this.i;
    };
    
    Complex.prototype.realPart = function(){
	return this.r;
    };
    
    Complex.prototype.round = function(){
	return this.r.round();
    };
    


    Numbers.makeRational = Rational.makeInstance;
    Numbers.makeFloatPoint = FloatPoint.makeInstance;
    Numbers.makeComplex = Complex.makeInstance;

    Numbers.pi = FloatPoint.pi;
    Numbers.e = FloatPoint.e;
    Numbers.nan = FloatPoint.nan;
    Numbers.inf = FloatPoint.inf;
    Numbers.negative_one = Rational.NEGATIVE_ONE;
    Numbers.zero = Rational.ZERO;
    Numbers.one = Rational.ONE;

    Numbers.i = plusI;
    Numbers.negative_i = minusI;








    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////


    // The rest of the code below comes from Tom Wu's BigInteger implementation:

    // Copyright (c) 2005  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Basic JavaScript BN library - subset useful for RSA encryption.

    // Bits per digit
    var dbits;

    // JavaScript engine analysis
    var canary = 0xdeadbeefcafe;
    var j_lm = ((canary&0xffffff)===0xefcafe);

    // (public) Constructor
    function BigInteger(a,b,c) {
	if(a !== null)
	    if("number" === typeof a) this.fromNumber(a,b,c);
	else if(b === null && "string" !== typeof a) this.fromString(a,256);
	else this.fromString(a,b);
    }

    // return new, unset BigInteger
    function nbi() { return new BigInteger(null); }

    // am: Compute w_j += (x*this_i), propagate carries,
    // c is initial carry, returns final carry.
    // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
    // We need to select the fastest one that works in this environment.

    // am1: use a single mult and divide to get the high bits,
    // max digit bits should be 26 because
    // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
    function am1(i,x,w,j,c,n) {
	while(--n >= 0) {
	    var v = x*this[i++]+w[j]+c;
	    c = Math.floor(v/0x4000000);
	    w[j++] = v&0x3ffffff;
	}
	return c;
    }
    // am2 avoids a big mult-and-extract completely.
    // Max digit bits should be <= 30 because we do bitwise ops
    // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
    function am2(i,x,w,j,c,n) {
	var xl = x&0x7fff, xh = x>>15;
	while(--n >= 0) {
	    var l = this[i]&0x7fff;
	    var h = this[i++]>>15;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
	    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
	    w[j++] = l&0x3fffffff;
	}
	return c;
    }
    // Alternately, set max digit bits to 28 since some
    // browsers slow down when dealing with 32-bit numbers.
    function am3(i,x,w,j,c,n) {
	var xl = x&0x3fff, xh = x>>14;
	while(--n >= 0) {
	    var l = this[i]&0x3fff;
	    var h = this[i++]>>14;
	    var m = xh*l+h*xl;
	    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
	    c = (l>>28)+(m>>14)+xh*h;
	    w[j++] = l&0xfffffff;
	}
	return c;
    }
    if(j_lm && (navigator.appName === "Microsoft Internet Explorer")) {
	BigInteger.prototype.am = am2;
	dbits = 30;
    }
    else if(j_lm && (navigator.appName !== "Netscape")) {
	BigInteger.prototype.am = am1;
	dbits = 26;
    }
    else { // Mozilla/Netscape seems to prefer am3
	BigInteger.prototype.am = am3;
	dbits = 28;
    }

    BigInteger.prototype.DB = dbits;
    BigInteger.prototype.DM = ((1<<dbits)-1);
    BigInteger.prototype.DV = (1<<dbits);

    var BI_FP = 52;
    BigInteger.prototype.FV = Math.pow(2,BI_FP);
    BigInteger.prototype.F1 = BI_FP-dbits;
    BigInteger.prototype.F2 = 2*dbits-BI_FP;

    // Digit conversions
    var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
    var BI_RC = new Array();
    var rr,vv;
    rr = "0".charCodeAt(0);
    for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
    rr = "a".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
    rr = "A".charCodeAt(0);
    for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

    function int2char(n) { return BI_RM.charAt(n); }
    function intAt(s,i) {
	var c = BI_RC[s.charCodeAt(i)];
	return (c===null)?-1:c;
    }

    // (protected) copy this to r
    function bnpCopyTo(r) {
	for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
	r.t = this.t;
	r.s = this.s;
    }

    // (protected) set from integer value x, -DV <= x < DV
    function bnpFromInt(x) {
	this.t = 1;
	this.s = (x<0)?-1:0;
	if(x > 0) this[0] = x;
	else if(x < -1) this[0] = x+DV;
	else this.t = 0;
    }

    // return bigint initialized to value
    function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

    // (protected) set from string and radix
    function bnpFromString(s,b) {
	var k;
	if(b === 16) k = 4;
	else if(b === 8) k = 3;
	else if(b === 256) k = 8; // byte array
	else if(b === 2) k = 1;
	else if(b === 32) k = 5;
	else if(b === 4) k = 2;
	else { this.fromRadix(s,b); return; }
	this.t = 0;
	this.s = 0;
	var i = s.length, mi = false, sh = 0;
	while(--i >= 0) {
	    var x = (k===8)?s[i]&0xff:intAt(s,i);
	    if(x < 0) {
		if(s.charAt(i) === "-") mi = true;
		continue;
	    }
	    mi = false;
	    if(sh === 0)
		this[this.t++] = x;
	    else if(sh+k > this.DB) {
		this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
		this[this.t++] = (x>>(this.DB-sh));
	    }
	    else
		this[this.t-1] |= x<<sh;
	    sh += k;
	    if(sh >= this.DB) sh -= this.DB;
	}
	if(k === 8 && (s[0]&0x80) !== 0) {
	    this.s = -1;
	    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
	}
	this.clamp();
	if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) clamp off excess high words
    function bnpClamp() {
	var c = this.s&this.DM;
	while(this.t > 0 && this[this.t-1] === c) --this.t;
    }

    // (public) return string representation in given radix
    function bnToString(b) {
	if(this.s < 0) return "-"+this.negate().toString(b);
	var k;
	if(b === 16) k = 4;
	else if(b === 8) k = 3;
	else if(b === 2) k = 1;
	else if(b === 32) k = 5;
	else if(b === 4) k = 2;
	else return this.toRadix(b);
	var km = (1<<k)-1, d, m = false, r = "", i = this.t;
	var p = this.DB-(i*this.DB)%k;
	if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
	    while(i >= 0) {
		if(p < k) {
		    d = (this[i]&((1<<p)-1))<<(k-p);
		    d |= this[--i]>>(p+=this.DB-k);
		}
		else {
		    d = (this[i]>>(p-=k))&km;
		    if(p <= 0) { p += this.DB; --i; }
		}
		if(d > 0) m = true;
		if(m) r += int2char(d);
	    }
	}
	return m?r:"0";
    }

    // (public) -this
    function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

    // (public) |this|
    function bnAbs() { return (this.s<0)?this.negate():this; }

    // (public) return + if this > a, - if this < a, 0 if equal
    function bnCompareTo(a) {
	var r = this.s-a.s;
	if(r !== 0) return r;
	var i = this.t;
	r = i-a.t;
	if(r !== 0) return r;
	while(--i >= 0) if((r=this[i]-a[i]) !== 0) return r;
	return 0;
    }

    // returns bit length of the integer x
    function nbits(x) {
	var r = 1, t;
	if((t=x>>>16) !== 0) { x = t; r += 16; }
	if((t=x>>8) !== 0) { x = t; r += 8; }
	if((t=x>>4) !== 0) { x = t; r += 4; }
	if((t=x>>2) !== 0) { x = t; r += 2; }
	if((t=x>>1) !== 0) { x = t; r += 1; }
	return r;
    }

    // (public) return the number of bits in "this"
    function bnBitLength() {
	if(this.t <= 0) return 0;
	return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
    }

    // (protected) r = this << n*DB
    function bnpDLShiftTo(n,r) {
	var i;
	for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
	for(i = n-1; i >= 0; --i) r[i] = 0;
	r.t = this.t+n;
	r.s = this.s;
    }

    // (protected) r = this >> n*DB
    function bnpDRShiftTo(n,r) {
	for(var i = n; i < this.t; ++i) r[i-n] = this[i];
	r.t = Math.max(this.t-n,0);
	r.s = this.s;
    }

    // (protected) r = this << n
    function bnpLShiftTo(n,r) {
	var bs = n%this.DB;
	var cbs = this.DB-bs;
	var bm = (1<<cbs)-1;
	var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
	for(i = this.t-1; i >= 0; --i) {
	    r[i+ds+1] = (this[i]>>cbs)|c;
	    c = (this[i]&bm)<<bs;
	}
	for(i = ds-1; i >= 0; --i) r[i] = 0;
	r[ds] = c;
	r.t = this.t+ds+1;
	r.s = this.s;
	r.clamp();
    }

    // (protected) r = this >> n
    function bnpRShiftTo(n,r) {
	r.s = this.s;
	var ds = Math.floor(n/this.DB);
	if(ds >= this.t) { r.t = 0; return; }
	var bs = n%this.DB;
	var cbs = this.DB-bs;
	var bm = (1<<bs)-1;
	r[0] = this[ds]>>bs;
	for(var i = ds+1; i < this.t; ++i) {
	    r[i-ds-1] |= (this[i]&bm)<<cbs;
	    r[i-ds] = this[i]>>bs;
	}
	if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
	r.t = this.t-ds;
	r.clamp();
    }

    // (protected) r = this - a
    function bnpSubTo(a,r) {
	var i = 0, c = 0, m = Math.min(a.t,this.t);
	while(i < m) {
	    c += this[i]-a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	}
	if(a.t < this.t) {
	    c -= a.s;
	    while(i < this.t) {
		c += this[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += this.s;
	}
	else {
	    c += this.s;
	    while(i < a.t) {
		c -= a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c -= a.s;
	}
	r.s = (c<0)?-1:0;
	if(c < -1) r[i++] = this.DV+c;
	else if(c > 0) r[i++] = c;
	r.t = i;
	r.clamp();
    }

    // (protected) r = this * a, r !== this,a (HAC 14.12)
    // "this" should be the larger one if appropriate.
    function bnpMultiplyTo(a,r) {
	var x = this.abs(), y = a.abs();
	var i = x.t;
	r.t = i+y.t;
	while(--i >= 0) r[i] = 0;
	for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
	r.s = 0;
	r.clamp();
	if(this.s !== a.s) BigInteger.ZERO.subTo(r,r);
    }

    // (protected) r = this^2, r !== this (HAC 14.16)
    function bnpSquareTo(r) {
	var x = this.abs();
	var i = r.t = 2*x.t;
	while(--i >= 0) r[i] = 0;
	for(i = 0; i < x.t-1; ++i) {
	    var c = x.am(i,x[i],r,2*i,0,1);
	    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
		r[i+x.t] -= x.DV;
		r[i+x.t+1] = 1;
	    }
	}
	if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
	r.s = 0;
	r.clamp();
    }

    // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
    // r !== q, this !== m.  q or r may be null.
    function bnpDivRemTo(m,q,r) {
	var pm = m.abs();
	if(pm.t <= 0) return;
	var pt = this.abs();
	if(pt.t < pm.t) {
	    if(q !== null) q.fromInt(0);
	    if(r !== null) this.copyTo(r);
	    return;
	}
	if(r === null) r = nbi();
	var y = nbi(), ts = this.s, ms = m.s;
	var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
	if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
	else { pm.copyTo(y); pt.copyTo(r); }
	var ys = y.t;
	var y0 = y[ys-1];
	if(y0 === 0) return;
	var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
	var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
	var i = r.t, j = i-ys, t = (q===null)?nbi():q;
	y.dlShiftTo(j,t);
	if(r.compareTo(t) >= 0) {
	    r[r.t++] = 1;
	    r.subTo(t,r);
	}
	BigInteger.ONE.dlShiftTo(ys,t);
	t.subTo(y,y);	// "negative" y so we can replace sub with am later
	while(y.t < ys) y[y.t++] = 0;
	while(--j >= 0) {
	    // Estimate quotient digit
	    var qd = (r[--i]===y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
	    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
		y.dlShiftTo(j,t);
		r.subTo(t,r);
		while(r[i] < --qd) r.subTo(t,r);
	    }
	}
	if(q !== null) {
	    r.drShiftTo(ys,q);
	    if(ts !== ms) BigInteger.ZERO.subTo(q,q);
	}
	r.t = ys;
	r.clamp();
	if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
	if(ts < 0) BigInteger.ZERO.subTo(r,r);
    }

    // (public) this mod a
    function bnMod(a) {
	var r = nbi();
	this.abs().divRemTo(a,null,r);
	if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
	return r;
    }

    // Modular reduction using "classic" algorithm
    function Classic(m) { this.m = m; }
    function cConvert(x) {
	if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
	else return x;
    }
    function cRevert(x) { return x; }
    function cReduce(x) { x.divRemTo(this.m,null,x); }
    function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
    function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    Classic.prototype.convert = cConvert;
    Classic.prototype.revert = cRevert;
    Classic.prototype.reduce = cReduce;
    Classic.prototype.mulTo = cMulTo;
    Classic.prototype.sqrTo = cSqrTo;

    // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
    // justification:
    //         xy === 1 (mod m)
    //         xy =  1+km
    //   xy(2-xy) = (1+km)(1-km)
    // x[y(2-xy)] = 1-k^2m^2
    // x[y(2-xy)] === 1 (mod m^2)
    // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
    // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
    // JS multiply "overflows" differently from C/C++, so care is needed here.
    function bnpInvDigit() {
	if(this.t < 1) return 0;
	var x = this[0];
	if((x&1) === 0) return 0;
	var y = x&3;		// y === 1/x mod 2^2
	y = (y*(2-(x&0xf)*y))&0xf;	// y === 1/x mod 2^4
	y = (y*(2-(x&0xff)*y))&0xff;	// y === 1/x mod 2^8
	y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y === 1/x mod 2^16
	// last step - calculate inverse mod DV directly;
	// assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
	y = (y*(2-x*y%this.DV))%this.DV;		// y === 1/x mod 2^dbits
	// we really want the negative inverse, and -DV < y < DV
	return (y>0)?this.DV-y:-y;
    }

    // Montgomery reduction
    function Montgomery(m) {
	this.m = m;
	this.mp = m.invDigit();
	this.mpl = this.mp&0x7fff;
	this.mph = this.mp>>15;
	this.um = (1<<(m.DB-15))-1;
	this.mt2 = 2*m.t;
    }

    // xR mod m
    function montConvert(x) {
	var r = nbi();
	x.abs().dlShiftTo(this.m.t,r);
	r.divRemTo(this.m,null,r);
	if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
	return r;
    }

    // x/R mod m
    function montRevert(x) {
	var r = nbi();
	x.copyTo(r);
	this.reduce(r);
	return r;
    }

    // x = x/R mod m (HAC 14.32)
    function montReduce(x) {
	while(x.t <= this.mt2)	// pad x so am has enough room later
	    x[x.t++] = 0;
	for(var i = 0; i < this.m.t; ++i) {
	    // faster way of calculating u0 = x[i]*mp mod DV
	    var j = x[i]&0x7fff;
	    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
	    // use am to combine the multiply-shift-add into one call
	    j = i+this.m.t;
	    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
	    // propagate carry
	    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
	}
	x.clamp();
	x.drShiftTo(this.m.t,x);
	if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = "x^2/R mod m"; x !== r
    function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = "xy/R mod m"; x,y !== r
    function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Montgomery.prototype.convert = montConvert;
    Montgomery.prototype.revert = montRevert;
    Montgomery.prototype.reduce = montReduce;
    Montgomery.prototype.mulTo = montMulTo;
    Montgomery.prototype.sqrTo = montSqrTo;

    // (protected) true iff this is even
    function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) === 0; }

    // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
    function bnpExp(e,z) {
	if(e > 0xffffffff || e < 1) return BigInteger.ONE;
	var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
	g.copyTo(r);
	while(--i >= 0) {
	    z.sqrTo(r,r2);
	    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
	    else { var t = r; r = r2; r2 = t; }
	}
	return z.revert(r);
    }

    // (public) this^e % m, 0 <= e < 2^32
    function bnModPowInt(e,m) {
	var z;
	if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
	return this.exp(e,z);
    }

    // protected
    BigInteger.prototype.copyTo = bnpCopyTo;
    BigInteger.prototype.fromInt = bnpFromInt;
    BigInteger.prototype.fromString = bnpFromString;
    BigInteger.prototype.clamp = bnpClamp;
    BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
    BigInteger.prototype.drShiftTo = bnpDRShiftTo;
    BigInteger.prototype.lShiftTo = bnpLShiftTo;
    BigInteger.prototype.rShiftTo = bnpRShiftTo;
    BigInteger.prototype.subTo = bnpSubTo;
    BigInteger.prototype.multiplyTo = bnpMultiplyTo;
    BigInteger.prototype.squareTo = bnpSquareTo;
    BigInteger.prototype.divRemTo = bnpDivRemTo;
    BigInteger.prototype.invDigit = bnpInvDigit;
    BigInteger.prototype.isEven = bnpIsEven;
    BigInteger.prototype.exp = bnpExp;

    // public
    BigInteger.prototype.toString = bnToString;
    BigInteger.prototype.negate = bnNegate;
    BigInteger.prototype.abs = bnAbs;
    BigInteger.prototype.compareTo = bnCompareTo;
    BigInteger.prototype.bitLength = bnBitLength;
    BigInteger.prototype.mod = bnMod;
    BigInteger.prototype.modPowInt = bnModPowInt;

    // "constants"
    BigInteger.ZERO = nbv(0);
    BigInteger.ONE = nbv(1);

    // Copyright (c) 2005-2009  Tom Wu
    // All Rights Reserved.
    // See "LICENSE" for details.

    // Extended JavaScript BN functions, required for RSA private ops.

    // Version 1.1: new BigInteger("0", 10) returns "proper" zero

    // (public)
    function bnClone() { var r = nbi(); this.copyTo(r); return r; }

    // (public) return value as integer
    function bnIntValue() {
	if(this.s < 0) {
	    if(this.t === 1) return this[0]-this.DV;
	    else if(this.t === 0) return -1;
	}
	else if(this.t === 1) return this[0];
	else if(this.t === 0) return 0;
	// assumes 16 < DB < 32
	return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
    }

    // (public) return value as byte
    function bnByteValue() { return (this.t===0)?this.s:(this[0]<<24)>>24; }

    // (public) return value as short (assumes DB>=16)
    function bnShortValue() { return (this.t===0)?this.s:(this[0]<<16)>>16; }

    // (protected) return x s.t. r^x < DV
    function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

    // (public) 0 if this === 0, 1 if this > 0
    function bnSigNum() {
	if(this.s < 0) return -1;
	else if(this.t <= 0 || (this.t === 1 && this[0] <= 0)) return 0;
	else return 1;
    }

    // (protected) convert to radix string
    function bnpToRadix(b) {
	if(b === null) b = 10;
	if(this.signum() === 0 || b < 2 || b > 36) return "0";
	var cs = this.chunkSize(b);
	var a = Math.pow(b,cs);
	var d = nbv(a), y = nbi(), z = nbi(), r = "";
	this.divRemTo(d,y,z);
	while(y.signum() > 0) {
	    r = (a+z.intValue()).toString(b).substr(1) + r;
	    y.divRemTo(d,y,z);
	}
	return z.intValue().toString(b) + r;
    }

    // (protected) convert from radix string
    function bnpFromRadix(s,b) {
	this.fromInt(0);
	if(b === null) b = 10;
	var cs = this.chunkSize(b);
	var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
	for(var i = 0; i < s.length; ++i) {
	    var x = intAt(s,i);
	    if(x < 0) {
		if(s.charAt(i) === "-" && this.signum() === 0) mi = true;
		continue;
	    }
	    w = b*w+x;
	    if(++j >= cs) {
		this.dMultiply(d);
		this.dAddOffset(w,0);
		j = 0;
		w = 0;
	    }
	}
	if(j > 0) {
	    this.dMultiply(Math.pow(b,j));
	    this.dAddOffset(w,0);
	}
	if(mi) BigInteger.ZERO.subTo(this,this);
    }

    // (protected) alternate constructor
    function bnpFromNumber(a,b,c) {
	if("number" === typeof b) {
	    // new BigInteger(int,int,RNG)
	    if(a < 2) this.fromInt(1);
	    else {
		this.fromNumber(a,c);
		if(!this.testBit(a-1))	// force MSB set
		    this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
		if(this.isEven()) this.dAddOffset(1,0); // force odd
		while(!this.isProbablePrime(b)) {
		    this.dAddOffset(2,0);
		    if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
		}
	    }
	}
	else {
	    // new BigInteger(int,RNG)
	    var x = new Array(), t = a&7;
	    x.length = (a>>3)+1;
	    b.nextBytes(x);
	    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	    this.fromString(x,256);
	}
    }

    // (public) convert to bigendian byte array
    function bnToByteArray() {
	var i = this.t, r = new Array();
	r[0] = this.s;
	var p = this.DB-(i*this.DB)%8, d, k = 0;
	if(i-- > 0) {
	    if(p < this.DB && (d = this[i]>>p) !== (this.s&this.DM)>>p)
		r[k++] = d|(this.s<<(this.DB-p));
	    while(i >= 0) {
		if(p < 8) {
		    d = (this[i]&((1<<p)-1))<<(8-p);
		    d |= this[--i]>>(p+=this.DB-8);
		}
		else {
		    d = (this[i]>>(p-=8))&0xff;
		    if(p <= 0) { p += this.DB; --i; }
		}
		if((d&0x80) !== 0) d |= -256;
		if(k === 0 && (this.s&0x80) !== (d&0x80)) ++k;
		if(k > 0 || d !== this.s) r[k++] = d;
	    }
	}
	return r;
    }

    function bnEquals(a) { return(this.compareTo(a)===0); }
    function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
    function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

    // (protected) r = this op a (bitwise)
    function bnpBitwiseTo(a,op,r) {
	var i, f, m = Math.min(a.t,this.t);
	for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
	if(a.t < this.t) {
	    f = a.s&this.DM;
	    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
	    r.t = this.t;
	}
	else {
	    f = this.s&this.DM;
	    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
	    r.t = a.t;
	}
	r.s = op(this.s,a.s);
	r.clamp();
    }

    // (public) this & a
    function op_and(x,y) { return x&y; }
    function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

    // (public) this | a
    function op_or(x,y) { return x|y; }
    function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

    // (public) this ^ a
    function op_xor(x,y) { return x^y; }
    function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

    // (public) this & ~a
    function op_andnot(x,y) { return x&~y; }
    function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

    // (public) ~this
    function bnNot() {
	var r = nbi();
	for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
	r.t = this.t;
	r.s = ~this.s;
	return r;
    }

    // (public) this << n
    function bnShiftLeft(n) {
	var r = nbi();
	if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
	return r;
    }

    // (public) this >> n
    function bnShiftRight(n) {
	var r = nbi();
	if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
	return r;
    }

    // return index of lowest 1-bit in x, x < 2^31
    function lbit(x) {
	if(x === 0) return -1;
	var r = 0;
	if((x&0xffff) === 0) { x >>= 16; r += 16; }
	if((x&0xff) === 0) { x >>= 8; r += 8; }
	if((x&0xf) === 0) { x >>= 4; r += 4; }
	if((x&3) === 0) { x >>= 2; r += 2; }
	if((x&1) === 0) ++r;
	return r;
    }

    // (public) returns index of lowest 1-bit (or -1 if none)
    function bnGetLowestSetBit() {
	for(var i = 0; i < this.t; ++i)
	    if(this[i] !== 0) return i*this.DB+lbit(this[i]);
	if(this.s < 0) return this.t*this.DB;
	return -1;
    }

    // return number of 1 bits in x
    function cbit(x) {
	var r = 0;
	while(x !== 0) { x &= x-1; ++r; }
	return r;
    }

    // (public) return number of set bits
    function bnBitCount() {
	var r = 0, x = this.s&this.DM;
	for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
	return r;
    }

    // (public) true iff nth bit is set
    function bnTestBit(n) {
	var j = Math.floor(n/this.DB);
	if(j >= this.t) return(this.s!==0);
	return((this[j]&(1<<(n%this.DB)))!==0);
    }

    // (protected) this op (1<<n)
    function bnpChangeBit(n,op) {
	var r = BigInteger.ONE.shiftLeft(n);
	this.bitwiseTo(r,op,r);
	return r;
    }

    // (public) this | (1<<n)
    function bnSetBit(n) { return this.changeBit(n,op_or); }

    // (public) this & ~(1<<n)
    function bnClearBit(n) { return this.changeBit(n,op_andnot); }

    // (public) this ^ (1<<n)
    function bnFlipBit(n) { return this.changeBit(n,op_xor); }

    // (protected) r = this + a
    function bnpAddTo(a,r) {
	var i = 0, c = 0, m = Math.min(a.t,this.t);
	while(i < m) {
	    c += this[i]+a[i];
	    r[i++] = c&this.DM;
	    c >>= this.DB;
	}
	if(a.t < this.t) {
	    c += a.s;
	    while(i < this.t) {
		c += this[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += this.s;
	}
	else {
	    c += this.s;
	    while(i < a.t) {
		c += a[i];
		r[i++] = c&this.DM;
		c >>= this.DB;
	    }
	    c += a.s;
	}
	r.s = (c<0)?-1:0;
	if(c > 0) r[i++] = c;
	else if(c < -1) r[i++] = this.DV+c;
	r.t = i;
	r.clamp();
    }

    // (public) this + a
    function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

    // (public) this - a
    function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

    // (public) this * a
    function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

    // (public) this / a
    function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

    // (public) this % a
    function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

    // (public) [this/a,this%a]
    function bnDivideAndRemainder(a) {
	var q = nbi(), r = nbi();
	this.divRemTo(a,q,r);
	return new Array(q,r);
    }

    // (protected) this *= n, this >= 0, 1 < n < DV
    function bnpDMultiply(n) {
	this[this.t] = this.am(0,n-1,this,0,0,this.t);
	++this.t;
	this.clamp();
    }

    // (protected) this += n << w words, this >= 0
    function bnpDAddOffset(n,w) {
	if(n === 0) return;
	while(this.t <= w) this[this.t++] = 0;
	this[w] += n;
	while(this[w] >= this.DV) {
	    this[w] -= this.DV;
	    if(++w >= this.t) this[this.t++] = 0;
	    ++this[w];
	}
    }

    // A "null" reducer
    function NullExp() {}
    function nNop(x) { return x; }
    function nMulTo(x,y,r) { x.multiplyTo(y,r); }
    function nSqrTo(x,r) { x.squareTo(r); }

    NullExp.prototype.convert = nNop;
    NullExp.prototype.revert = nNop;
    NullExp.prototype.mulTo = nMulTo;
    NullExp.prototype.sqrTo = nSqrTo;

    // (public) this^e
    function bnPow(e) { return this.exp(e,new NullExp()); }

    // (protected) r = lower n words of "this * a", a.t <= n
    // "this" should be the larger one if appropriate.
    function bnpMultiplyLowerTo(a,n,r) {
	var i = Math.min(this.t+a.t,n);
	r.s = 0; // assumes a,this >= 0
	r.t = i;
	while(i > 0) r[--i] = 0;
	var j;
	for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
	for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
	r.clamp();
    }

    // (protected) r = "this * a" without lower n words, n > 0
    // "this" should be the larger one if appropriate.
    function bnpMultiplyUpperTo(a,n,r) {
	--n;
	var i = r.t = this.t+a.t-n;
	r.s = 0; // assumes a,this >= 0
	while(--i >= 0) r[i] = 0;
	for(i = Math.max(n-this.t,0); i < a.t; ++i)
	    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
	r.clamp();
	r.drShiftTo(1,r);
    }

    // Barrett modular reduction
    function Barrett(m) {
	// setup Barrett
	this.r2 = nbi();
	this.q3 = nbi();
	BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
	this.mu = this.r2.divide(m);
	this.m = m;
    }

    function barrettConvert(x) {
	if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
	else if(x.compareTo(this.m) < 0) return x;
	else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
    }

    function barrettRevert(x) { return x; }

    // x = x mod m (HAC 14.42)
    function barrettReduce(x) {
	x.drShiftTo(this.m.t-1,this.r2);
	if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
	this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
	this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
	while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
	x.subTo(this.r2,x);
	while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
    }

    // r = x^2 mod m; x !== r
    function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

    // r = x*y mod m; x,y !== r
    function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

    Barrett.prototype.convert = barrettConvert;
    Barrett.prototype.revert = barrettRevert;
    Barrett.prototype.reduce = barrettReduce;
    Barrett.prototype.mulTo = barrettMulTo;
    Barrett.prototype.sqrTo = barrettSqrTo;

    // (public) this^e % m (HAC 14.85)
    function bnModPow(e,m) {
	var i = e.bitLength(), k, r = nbv(1), z;
	if(i <= 0) return r;
	else if(i < 18) k = 1;
	else if(i < 48) k = 3;
	else if(i < 144) k = 4;
	else if(i < 768) k = 5;
	else k = 6;
	if(i < 8)
	    z = new Classic(m);
	else if(m.isEven())
	    z = new Barrett(m);
	else
	    z = new Montgomery(m);

	// precomputation
	var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
	g[1] = z.convert(this);
	if(k > 1) {
	    var g2 = nbi();
	    z.sqrTo(g[1],g2);
	    while(n <= km) {
		g[n] = nbi();
		z.mulTo(g2,g[n-2],g[n]);
		n += 2;
	    }
	}

	var j = e.t-1, w, is1 = true, r2 = nbi(), t;
	i = nbits(e[j])-1;
	while(j >= 0) {
	    if(i >= k1) w = (e[j]>>(i-k1))&km;
	    else {
		w = (e[j]&((1<<(i+1))-1))<<(k1-i);
		if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
	    }

	    n = k;
	    while((w&1) === 0) { w >>= 1; --n; }
	    if((i -= n) < 0) { i += this.DB; --j; }
	    if(is1) {	// ret === 1, don't bother squaring or multiplying it
		g[w].copyTo(r);
		is1 = false;
	    }
	    else {
		while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
		if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
		z.mulTo(r2,g[w],r);
	    }

	    while(j >= 0 && (e[j]&(1<<i)) === 0) {
		z.sqrTo(r,r2); t = r; r = r2; r2 = t;
		if(--i < 0) { i = this.DB-1; --j; }
	    }
	}
	return z.revert(r);
    }

    // (public) gcd(this,a) (HAC 14.54)
    function bnGCD(a) {
	var x = (this.s<0)?this.negate():this.clone();
	var y = (a.s<0)?a.negate():a.clone();
	if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
	var i = x.getLowestSetBit(), g = y.getLowestSetBit();
	if(g < 0) return x;
	if(i < g) g = i;
	if(g > 0) {
	    x.rShiftTo(g,x);
	    y.rShiftTo(g,y);
	}
	while(x.signum() > 0) {
	    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
	    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
	    if(x.compareTo(y) >= 0) {
		x.subTo(y,x);
		x.rShiftTo(1,x);
	    }
	    else {
		y.subTo(x,y);
		y.rShiftTo(1,y);
	    }
	}
	if(g > 0) y.lShiftTo(g,y);
	return y;
    }

    // (protected) this % n, n < 2^26
    function bnpModInt(n) {
	if(n <= 0) return 0;
	var d = this.DV%n, r = (this.s<0)?n-1:0;
	if(this.t > 0)
	    if(d === 0) r = this[0]%n;
	else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
	return r;
    }

    // (public) 1/this % m (HAC 14.61)
    function bnModInverse(m) {
	var ac = m.isEven();
	if((this.isEven() && ac) || m.signum() === 0) return BigInteger.ZERO;
	var u = m.clone(), v = this.clone();
	var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
	while(u.signum() !== 0) {
	    while(u.isEven()) {
		u.rShiftTo(1,u);
		if(ac) {
		    if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
		    a.rShiftTo(1,a);
		}
		else if(!b.isEven()) b.subTo(m,b);
		b.rShiftTo(1,b);
	    }
	    while(v.isEven()) {
		v.rShiftTo(1,v);
		if(ac) {
		    if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
		    c.rShiftTo(1,c);
		}
		else if(!d.isEven()) d.subTo(m,d);
		d.rShiftTo(1,d);
	    }
	    if(u.compareTo(v) >= 0) {
		u.subTo(v,u);
		if(ac) a.subTo(c,a);
		b.subTo(d,b);
	    }
	    else {
		v.subTo(u,v);
		if(ac) c.subTo(a,c);
		d.subTo(b,d);
	    }
	}
	if(v.compareTo(BigInteger.ONE) !== 0) return BigInteger.ZERO;
	if(d.compareTo(m) >= 0) return d.subtract(m);
	if(d.signum() < 0) d.addTo(m,d); else return d;
	if(d.signum() < 0) return d.add(m); else return d;
    }

    var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509];
    var lplim = (1<<26)/lowprimes[lowprimes.length-1];

    // (public) test primality with certainty >= 1-.5^t
    function bnIsProbablePrime(t) {
	var i, x = this.abs();
	if(x.t === 1 && x[0] <= lowprimes[lowprimes.length-1]) {
	    for(i = 0; i < lowprimes.length; ++i)
		if(x[0] === lowprimes[i]) return true;
	    return false;
	}
	if(x.isEven()) return false;
	i = 1;
	while(i < lowprimes.length) {
	    var m = lowprimes[i], j = i+1;
	    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
	    m = x.modInt(m);
	    while(i < j) if(m%lowprimes[i++] === 0) return false;
	}
	return x.millerRabin(t);
    }

    // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
    function bnpMillerRabin(t) {
	var n1 = this.subtract(BigInteger.ONE);
	var k = n1.getLowestSetBit();
	if(k <= 0) return false;
	var r = n1.shiftRight(k);
	t = (t+1)>>1;
	if(t > lowprimes.length) t = lowprimes.length;
	var a = nbi();
	for(var i = 0; i < t; ++i) {
	    a.fromInt(lowprimes[i]);
	    var y = a.modPow(r,this);
	    if(y.compareTo(BigInteger.ONE) !== 0 && y.compareTo(n1) !== 0) {
		var j = 1;
		while(j++ < k && y.compareTo(n1) !== 0) {
		    y = y.modPowInt(2,this);
		    if(y.compareTo(BigInteger.ONE) === 0) return false;
		}
		if(y.compareTo(n1) !== 0) return false;
	    }
	}
	return true;
    }

    // protected
    BigInteger.prototype.chunkSize = bnpChunkSize;
    BigInteger.prototype.toRadix = bnpToRadix;
    BigInteger.prototype.fromRadix = bnpFromRadix;
    BigInteger.prototype.fromNumber = bnpFromNumber;
    BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
    BigInteger.prototype.changeBit = bnpChangeBit;
    BigInteger.prototype.addTo = bnpAddTo;
    BigInteger.prototype.dMultiply = bnpDMultiply;
    BigInteger.prototype.dAddOffset = bnpDAddOffset;
    BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
    BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
    BigInteger.prototype.modInt = bnpModInt;
    BigInteger.prototype.millerRabin = bnpMillerRabin;

    // public
    BigInteger.prototype.clone = bnClone;
    BigInteger.prototype.intValue = bnIntValue;
    BigInteger.prototype.byteValue = bnByteValue;
    BigInteger.prototype.shortValue = bnShortValue;
    BigInteger.prototype.signum = bnSigNum;
    BigInteger.prototype.toByteArray = bnToByteArray;
    BigInteger.prototype.equals = bnEquals;
    BigInteger.prototype.min = bnMin;
    BigInteger.prototype.max = bnMax;
    BigInteger.prototype.and = bnAnd;
    BigInteger.prototype.or = bnOr;
    BigInteger.prototype.xor = bnXor;
    BigInteger.prototype.andNot = bnAndNot;
    BigInteger.prototype.not = bnNot;
    BigInteger.prototype.shiftLeft = bnShiftLeft;
    BigInteger.prototype.shiftRight = bnShiftRight;
    BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
    BigInteger.prototype.bitCount = bnBitCount;
    BigInteger.prototype.testBit = bnTestBit;
    BigInteger.prototype.setBit = bnSetBit;
    BigInteger.prototype.clearBit = bnClearBit;
    BigInteger.prototype.flipBit = bnFlipBit;
    BigInteger.prototype.add = bnAdd;
    BigInteger.prototype.subtract = bnSubtract;
    BigInteger.prototype.multiply = bnMultiply;
    BigInteger.prototype.divide = bnDivide;
    BigInteger.prototype.remainder = bnRemainder;
    BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
    BigInteger.prototype.modPow = bnModPow;
    BigInteger.prototype.modInverse = bnModInverse;
    BigInteger.prototype.pow = bnPow;
    BigInteger.prototype.gcd = bnGCD;
    BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

    // BigInteger interfaces not implemented in jsbn:

    // BigInteger(int signum, byte[] magnitude)
    // double doubleValue()
    // float floatValue()
    // int hashCode()
    // long longValue()
    // static BigInteger valueOf(long val)






})();