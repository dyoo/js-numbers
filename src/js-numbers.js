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
	return (thing !== undefined &&
		thing !== null &&
		(thing instanceof Rational ||
		 thing instanceof FloatPoint ||
		 thing instanceof Complex));
    }

    // isFinite: scheme-number -> boolean
    Numbers.isFinite = function(n) {
	return n.isFinite();
    };

    Numbers.isRational = function(n) {
	return n.isRational();
    };

    Numbers.isReal = function(n) {
	return n.isReal();
    };

    Numbers.isExact = function(n) {
	return n.isExact();
    }

    // isInteger: scheme-number -> boolean
    Numbers.isInteger = function(n) { 
	return n.isInteger();
    };

    // toFixnum: scheme-number -> javascript-number
    Numbers.toFixnum = function(num) {
	return num.toFixnum();
    };
 
    // toFloat: scheme-number -> javascript-number
    Numbers.toFloat = function(num) {
	return num.toFloat();
    };    

    // toExact: scheme-number -> scheme-number
    Numbers.toExact = function(x) {
	return x.toExact();
    };

    // toComplex: scheme-number -> scheme-number
    Numbers.toComplex = function(x) {
	return x.toComplex();
    }


    //////////////////////////////////////////////////////////////////////


    // add: scheme-number scheme-number -> scheme-number
    Numbers.add = addLifts(function(x, y) {
	return x.add(y);
    });

    // subtract: scheme-number scheme-number -> scheme-number
    Numbers.subtract = addLifts(function(x, y) {
	return x.subtract(y);
    });
    
    // mulitply: scheme-number scheme-number -> scheme-number
    Numbers.multiply = addLifts(function(x, y) {
	return x.multiply(y);
    });
    
    // divide: scheme-number scheme-number -> scheme-number
    Numbers.divide = addLifts(function(x, y) {
	return x.divide(y);
    });
    
    // equals: scheme-number scheme-number -> boolean
    Numbers.equals = addLifts(function(x, y) {
	return x.equals(y);
    });

    // eqv: scheme-number scheme-number -> boolean
    Numbers.eqv = function(x, y) {
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
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError(
		"greaterThanOrEqual: couldn't be applied to complex number");
	return x.greaterThanOrEqual(y);
    });
 
    // lessThanOrEqual: scheme-number scheme-number -> boolean
    Numbers.lessThanOrEqual = addLifts(function(x, y){
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("lessThanOrEqual: couldn't be applied to complex number");
	return x.lessThanOrEqual(y);    	
    });

    // greaterThan: scheme-number scheme-number -> boolean
    Numbers.greaterThan = addLifts(function(x, y){
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("greaterThan: couldn't be applied to complex number");
	return x.greaterThan(y);	
    });
    
    // lessThan: scheme-number scheme-number -> boolean
    Numbers.lessThan = addLifts(function(x, y){
	if (!(x.isReal() && y.isReal()))
	    Numbers.throwRuntimeError("lessThan: couldn't be applied to complex number");
	return x.lessThan(y);
    });
    
    // expt: scheme-number scheme-number -> scheme-number
    Numbers.expt = addLifts(function(x, y){
	return x.expt(y);
    });
    

    // modulo: scheme-number scheme-number -> scheme-number
    Numbers.modulo = function(m, n) {
	var result = 
	    Rational.makeInstance(m.toFixnum() % n.toFixnum(),
				  1);

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
	return n.numerator();
    };


    Numbers.denominator = function(n) {
	return n.denominator();
    };

    Numbers.sqrt = function(n) {
	return n.sqrt();
    }

    // abs: scheme-number -> scheme-number
    Numbers.abs = function(n) {
	return n.abs();
    };
    
    Numbers.floor = function(n) {
	return n.floor();
    };

    Numbers.ceiling = function(n) {
	return n.ceiling();
    };

    Numbers.conjugate = function(n) {
	return n.conjugate();
    };

    Numbers.magnitude = function(n) {
	return n.magnitude();
    };

    Numbers.log = function(n) {
	return n.log();
    }


    Numbers.angle = function(n) {
	return n.angle();
    };

    Numbers.atan = function(n) {
	return n.atan();
    };

    // cos: scheme-number -> scheme-number
    Numbers.cos = function(n) {
	return n.cos();
    };

    Numbers.sin = function(n) {
	return n.sin();
    };

    Numbers.acos = function(n) {
	return n.acos();
    };

    Numbers.asin = function(n) {
	return n.asin();
    }

    Numbers.imaginaryPart = function(n) {
	return n.imaginaryPart();
    }

    Numbers.realPart = function(n) {
	return n.realPart();
    }

    Numbers.round = function(n) {
	return n.round();
    }


    // exp: scheme-number -> scheme-number
    Numbers.exp = function(x) {
	return x.exp();
    };


    // sqr: scheme-number -> scheme-number
    Numbers.sqr = function(x) {
	return Numbers.multiply(x, x);
    };

    // gcd: scheme-number [scheme-number ...] -> scheme-number
    Numbers.gcd = function(first, rest) {
	var result = Math.abs(first.toFixnum());
	for (var i = 0; i < rest.length; i++) {
	    result = _gcd(result, rest[i].toFixnum());
	}
	return Rational.makeInstance(result);	
    };

    // lcm: scheme-number [scheme-number ...] -> scheme-number
    Numbers.lcm = function(first, rest) {
	var result = Math.abs(first.toFixnum());
	if (result == 0) { return Rational.ZERO; }
	for (var i = 0; i < rest.length; i++) {
	    if (rest[i].toFixnum() == 0) {
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
	while (b != 0) {
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
    
    // ???
    // toFloat: -> javascript-number
    // Produce a javascript number

    // ???
    // toComplex: -> scheme-number
    // Coerse to Complex

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
	if (d == undefined) { d = 1; }
	if (d == 0) {
	    Numbers.throwRuntimeError("cannot have zero denominator.");
	}
	var divisor = gcd(Math.abs(n), Math.abs(d));
	this.n = n / divisor;
	this.d = d / divisor;
    };

    
    Rational.prototype.toString = function() {
	if (this.d == 1) {
	    return this.n + "";
	} else {
	    return this.n + "/" + this.d;
	}
    };

    
    Rational.prototype._level = function() {
	return 0;
    };
    
    
    Rational.prototype._lift = function(target) {
	if (target._level == 1)
	    return FloatPoint.makeInstance(this.n / this.d);
	if (target._level == 2)	
	    return Complex.makeInstance(this, 
					Rational.ZERO);
	Numbers.throwRuntimeError("invalid _level of Number");
    };
    
    Rational.prototype.isFinite = function() {
	return true;
    };

    Rational.prototype.equals = function(other) {
	return other instanceof Rational &&
	    this.n == other.n &&
	    this.d == other.d;
    };

    Rational.prototype.eqv = function(other) {
	return other instanceof Rational &&
	    this.n == other.n &&
	    this.d == other.d;
    };


    Rational.prototype.isInteger = function() { 
	return this.d == 1;
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
	if (this.d * other.n == 0) {
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
    
    Rational.prototype.toFloat = function() {
	return this.n / this.d;
    };
    
    Rational.prototype.toComplex = function(){
	return Complex.makeInstance(this, Rational.ZERO);
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
	    if (Math.floor(newN) == newN &&
		Math.floor(newD) == newD) {
		return Rational.makeInstance(newN, newD);
	    } else {
		return FloatPoint.makeInstance(newN / newD);
	    }
	} else {
	    var newN = Math.sqrt(- this.n);
	    var newD = Math.sqrt(this.d);
	    if (Math.floor(newN) == newN &&
		Math.floor(newD) == newD) {
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
    
    Rational.prototype.conjugate = Rational.prototype.abs;
    
    Rational.prototype.magnitude = Rational.prototype.abs;
    
    Rational.prototype.log = function(){
	return FloatPoint.makeInstance(Math.log(this.n / this.d));
    };
    
    Rational.prototype.angle = function(){
	if (0 == this.n)
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
    
    Rational.prototype.imag_dash_part = function(){
	return Rational.ZERO;
    };
    
    Rational.prototype.real_dash_part = function(){
	return this;
    };

    
    Rational.prototype.round = function() {
	if (this.d == 2) {
	    // Round to even if it's a n/2
	    var v = this.n / this.d;
	    var fl = Math.floor(v);
	    var ce = Math.ceil(v);
	    if (fl % 2 == 0) { 
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
	if (n == undefined)
	    Numbers.throwRuntimeError("n undefined");

	if (d == undefined) { d = 1; }
	
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


	if (d == 1 && n in _rationalCache) {
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
	if (this.n == Number.POSITIVE_INFINITY) {
	    return "+inf.0";
	} else if (this.n == Number.NEGATIVE_INFINITY) {
	    return "-inf.0";
	} else if (this.n == Number.NaN) {
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
        return this.isFinite() && this.n == Math.floor(this.n);
    };

    FloatPoint.prototype.isInteger = function() {
	return this.isFinite() && this.n == Math.floor(this.n);
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
		return ((sign(this) * sign(other) == 1) ?
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
	    if (sign(this) == sign(other)) {
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
	if (this.n == 0 || other.n == 0) { return Rational.ZERO; }

	if (this.isFinite() && other.isFinite()) {
	    return FloatPoint.makeInstance(this.n * other.n);
	} else if (isNaN(this.n) || isNaN(other.n)) {
	    return NaN;
	} else {
	    return ((sign(this) * sign(other) == 1) ? inf : neginf);
	}
    };
    
    FloatPoint.prototype.divide = function(other) {
	if (this.isFinite() && other.isFinite()) {
	    if (other.n == 0) {
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
	    return ((sign(this) * sign(other) == 1) ? inf : neginf);
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


    FloatPoint.prototype.toFloat = function() {
	return this.n;
    };
    
    FloatPoint.prototype.toComplex = function(){
	return Complex.makeInstance(this, Rational.ZERO);
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
	    return this.toComplex().log();
	else
	    return FloatPoint.makeInstance(Math.log(this.n));
    };
    
    FloatPoint.prototype.angle = function(){
	if (0 == this.n)
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
	if (this.n == 1) {
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
    
    FloatPoint.prototype.imag_dash_part = function(){
	return Rational.ZERO;
    };
    
    FloatPoint.prototype.real_dash_part = function(){
	return this;
    };
    
    
    FloatPoint.prototype.round = function(){
	if (isFinite(this.n)) {
	    if (Math.abs(Math.floor(this.n) - this.n) == 0.5) {
		if (Math.floor(this.n) % 2 == 0)
		    return Rational.makeInstance(Math.floor(this.n));
		return Rational.makeInstance(Math.ceil(this.n));
	    } else {
		return Rational.makeInstance(Math.round(this.n));
	    }
	} else {
	    return this;
	}	
    };
    
    
    FloatPoint.prototype.conjugate = FloatPoint.prototype.abs;
    
    FloatPoint.prototype.magnitude = FloatPoint.prototype.abs;
    


    //////////////////////////////////////////////////////////////////////
    // Complex numbers
    //////////////////////////////////////////////////////////////////////    
    
    Complex = function(r, i){
	this.r = r;
	this.i = i;
    };
    
    // Constructs a complex number from two basic number r and i.  r and i can
    // either be plt.type.Rational or plt.type.FloatPoint.
    Complex.makeInstance = function(r, i){
	if (typeof(r) == 'number') {
	    r = (r == Math.floor(r) ? Rational.makeInstance(r) :
		 FloatPoint.makeInstance(r));
	}
	if (typeof(i) == 'number') {
	    i = (i == Math.floor(i) ? Rational.makeInstance(i) :
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
	    Numbers.throwRuntimeError(">: expects argument of type real number");
	}
	return Numbers.greaterThanOrEqual(this.r, other.r);
    };

    Complex.prototype.lessThan = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError(">: expects argument of type real number");
	}
	return Numbers.lessThan(this.r, other.r);
    };

    Complex.prototype.lessThanOrEqual = function(other) {
	if (! this.isReal() || ! other.isReal()) {
	    Numbers.throwRuntimeError(">: expects argument of type real number");
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

    
    Complex.prototype.toFloat = function(){
	if (!Numbers.equals(this.i, Rational.ZERO).valueOf())
	    Numbers.throwRuntimeError("toFloat: expects argument of type real number");
	return this.r.toFloat();
    };
    
    Complex.prototype.toComplex = function(){
	return this;
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
	var up =  Numbers.multiply(this, con).toComplex();

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
	return sum.sqrt();
    };
    
    Complex.prototype.isReal = function(){
	return Numbers.equals(this.i, Rational.ZERO);
    };
    
    Complex.prototype.sqrt = function(){
	if (this.isReal())
	    return this.r.sqrt();
	// http://en.wikipedia.org/wiki/Square_root#Square_roots_of_negative_and_complex_numbers	
	var r_plus_x = Numbers.add(this.magnitude(), this.r);

	var r = halve(r_plus_x).sqrt();

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
	    return this.r.acos();
	var pi_half = halve(FloatPoint.pi);
	var iz = timesI(this);
	var root = Numbers.subtract(Rational.ONE, this.multiply(this)).sqrt();
	var l = timesI(Numbers.add(iz, root).log());
	return Numbers.add(pi_half, l);
    };
    
    Complex.prototype.asin = function(){
	if (this.isReal())
	    return this.r.asin();

	var oneNegateThisSq = 
	    Numbers.subtract(
		Rational.ONE, 
		this.multiply(this));
	var sqrtOneNegateThisSq = oneNegateThisSq.sqrt();
	return Numbers.multiply(
	    Rational.TWO,
	    (Numbers.divide(
		this, 
		Numbers.add(
		    Rational.ONE,
		    sqrtOneNegateThisSq))).atan());
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
    
    Complex.prototype.imag_dash_part = function(){
	return this.i;
    };
    
    Complex.prototype.real_dash_part = function(){
	return this.r;
    };
    
    Complex.prototype.round = function(){
	return this.r.round();
    };
    


    Numbers.makeRational = Rational.makeInstance;
    Numbers.makeFloatPoint = FloatPoint.makeInstance;
    Numbers.makeComplex = Complex.makeInstance;

    
    Numbers.Rational = Rational;
    Numbers.FloatPoint = FloatPoint;
    Numbers.Complex = Complex;

    Numbers.pi = FloatPoint.pi;
    Numbers.e = FloatPoint.e;
    Numbers.nan = FloatPoint.nan;
    Numbers.inf = FloatPoint.inf;
    Numbers.negative_one = Rational.NEGATIVE_ONE;
    Numbers.zero = Rational.ZERO;
    Numbers.one = Rational.ONE;

    Numbers.i = plusI;
    Numbers.negative_i = minusI;
})();