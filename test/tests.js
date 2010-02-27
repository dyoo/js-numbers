// See http://jania.pe.kr/aw/moin.cgi/JSSpec/Manual for definition
// of test case API.


var N = plt.lib.Numbers;
var Rational = N.Rational;
var FloatPoint = N.FloatPoint;
var Complex = N.Complex;


describe('rational constructions', {
    'constructions' : function() { 
	value_of(N.isSchemeNumber(N.makeRational(42)))
	    .should_be_true(); 

	value_of(N.isSchemeNumber(N.makeRational(21, 2)))
	    .should_be_true(); 

	value_of(N.isSchemeNumber(N.makeRational(2, 1)))
	    .should_be_true(); 


	value_of(N.isSchemeNumber(N.makeRational(-17, -171)))
	    .should_be_true(); 

	value_of(N.isSchemeNumber(N.makeRational(17, -171)))
	    .should_be_true(); 
    },


    'reductions' : function() {
	value_of(N.equals(N.makeRational(1, 2),

			  N.makeRational(5, 10)))
	    .should_be_true();
	value_of(N.equals(N.makeRational(1, 2),

			  N.makeRational(6, 10)))

	value_of(N.equals(N.makeRational(1, 2),

			  N.makeRational(-1, -2)))
	    .should_be_true();
    }

});



describe('built-in constants', { 
    'pi': function() {
 	value_of(N.isSchemeNumber(N.pi)).should_be_true() },
    'e': function() {
	value_of(N.isSchemeNumber(N.e)).should_be_true() },
    'nan' : function() {
	value_of(N.isSchemeNumber(N.nan)).should_be_true() },
    'negative_inf' : function() {
	value_of(N.isSchemeNumber(N.negative_inf)).should_be_true() },
    'inf' : function() {
	value_of(N.isSchemeNumber(N.inf)).should_be_true() },
    'negative_one' : function() {
	value_of(N.isSchemeNumber(N.negative_one)).should_be_true() },
    'zero' : function() { 
	value_of(N.isSchemeNumber(N.zero)).should_be_true() },
    'one' : function() {
	value_of(N.isSchemeNumber(N.one)).should_be_true() },
    'i' : function() {
	value_of(N.isSchemeNumber(N.i)).should_be_true() },
    'negative_i' : function() {
	value_of(N.isSchemeNumber(N.negative_i)).should_be_true() }
});


describe('fromFixnum', {
    'fixnums': function() {
	value_of(N.equals(N.fromFixnum(42),
			  N.makeRational(42))).should_be_true();
	value_of(N.equals(N.fromFixnum("43"),
			  N.makeRational(43))).should_be_true();
	value_of(N.equals(N.fromFixnum("42"),
			  N.makeRational(43))).should_be_false();
    },
    'rationals': function() {
    },
    'floats': function() {
	value_of(N.equals(N.fromFixnum("42.1"),
			  N.makeFloat(42.1))).should_be_true();
    },
    'complex': function() {
    }
});



describe('equal', {
    'nan': function() {
	value_of(N.equals(N.nan, N.nan)).should_be_false();
    },

    'fixnum / fixnum': function() {
	value_of(N.equals(42, 42)).should_be_true();
	value_of(N.equals(42, 43)).should_be_false();
    },

    'fixnum / rational': function() {
	value_of(N.equals(42, N.makeRational(84, 2))).should_be_true();
	value_of(N.equals(42, N.makeRational(84, 3))).should_be_false();
    },
    
    'fixnum / float ' : function() {
	value_of(N.equals(1024, N.makeFloat(1024))).should_be_true();
	value_of(N.equals(1024, N.makeFloat(1024.0001))).should_be_false();
    },

    'fixnum / complex ': function() {
	value_of(N.equals(31337, N.makeComplex(31337))).should_be_true();
	value_of(N.equals(31337, N.makeComplex(31337, 1))).should_be_false();
    },

    'rational / rational ' : function() {
	value_of(N.equals(N.makeRational(23849),
			  N.makeRational(23849))).should_be_true();
	value_of(N.equals(N.makeRational(23849),
			  N.makeRational(23489))).should_be_false();
    },

    'rational / float': function() {
	value_of(N.equals(N.makeRational(2),
			  N.makeFloat(2))).should_be_true();
	value_of(N.equals(N.makeRational(2),
			  N.makeFloat(2.1))).should_be_false();
    },

    'rational / complex': function() {
	value_of(N.equals(N.makeRational(2),
			  N.makeComplex(2, 0))).should_be_true();
	value_of(N.equals(N.makeRational(2),
			  N.makeComplex(2, 1))).should_be_false();
	value_of(N.equals(N.makeRational(2),
			  N.makeComplex(0, 0))).should_be_false();
    },

    'float / float': function() {
	value_of(N.equals(N.pi, N.pi)).should_be_true();
	value_of(N.equals(N.pi, N.e)).should_be_false();
    },

    'float / complex': function() {
	value_of(N.equals(N.pi, N.makeComplex(N.pi, 0))).should_be_true();
	value_of(N.equals(N.pi, N.makeComplex(N.e, 0))).should_be_false();
    },

    'complex / complex': function() {
	value_of(N.equals(N.makeComplex(17, 2),
			  N.makeComplex(17, 2))).should_be_true();
	value_of(N.equals(N.makeComplex(17, 2),
			  N.makeComplex(2, 17))).should_be_false();
	value_of(N.equals(N.makeComplex(17, 2),
			  N.makeComplex(17, 17))).should_be_false();
	value_of(N.equals(N.makeComplex(2, 17),
			  N.makeComplex(17, 17))).should_be_false();

	value_of(N.equals(N.makeComplex(N.makeFloat(100), 0),
			  N.makeComplex(N.makeFloat(100), 0))).should_be_true();
	value_of(N.equals(N.makeComplex(N.makeFloat(100), 0),
			  N.makeComplex(N.makeRational(100), 0))).should_be_true();
	value_of(N.equals(N.makeComplex(N.makeFloat(100.1), 0),
			  N.makeComplex(N.makeRational(100), 0))).should_be_false();
	value_of(N.equals(N.makeComplex(N.makeFloat(100), 0),
			  N.makeComplex(N.makeRational(100), 1))).should_be_false();
    }
});


describe('eqv', {
    'nan' : function() {
	value_of(N.eqv(N.nan,
		       N.makeFloat(Number.NaN))).should_be_true();
    },

    'inf' : function() {
	value_of(N.eqv(N.inf, N.inf)).should_be_true();
	value_of(N.eqv(N.negative_inf, N.negative_inf)).should_be_true();
    },


    'fixnum / fixnum': function() {
	value_of(N.eqv(42, 42)).should_be_true();
	value_of(N.eqv(42, 43)).should_be_false();
    },

    'fixnum / rational': function() {
	value_of(N.eqv(42, N.makeRational(84, 2))).should_be_false();
	value_of(N.eqv(42, N.makeRational(84, 3))).should_be_false();
    },
    
    'fixnum / float ' : function() {
	value_of(N.eqv(1024, N.makeFloat(1024))).should_be_false();
	value_of(N.eqv(1024, N.makeFloat(1024.0001))).should_be_false();
    },

    'fixnum / complex' : function() {
	value_of(N.eqv(10, N.makeComplex(10))).should_be_false();
	value_of(N.eqv(10, N.makeComplex(0))).should_be_false();
    },

    'rational / rational': function() {
	value_of(N.eqv(N.makeRational(2, 3),
		       N.makeRational(2, 3))).should_be_true();
	value_of(N.eqv(N.makeRational(3, 2),
		       N.makeRational(2, 3))).should_be_false();
    },

    'rational / float': function() {
	value_of(N.eqv(N.makeRational(2),
		       N.makeFloat(2))).should_be_false();
	value_of(N.eqv(N.makeRational(2),
		       N.makeFloat(2.1))).should_be_false();
    },

    'rational / complex': function() {
	value_of(N.eqv(N.makeRational(2),
		       N.makeComplex(2, 0))).should_be_false();
	value_of(N.eqv(N.makeRational(2),
		       N.makeComplex(2, 1))).should_be_false();
	value_of(N.eqv(N.makeRational(2),
		       N.makeComplex(0, 0))).should_be_false();
    },

    'float / float': function() {
	value_of(N.eqv(N.pi, N.pi)).should_be_true();
	value_of(N.eqv(N.e, N.e)).should_be_true();
	value_of(N.eqv(N.pi, N.e)).should_be_false();
    },

    'float / complex': function() {
	value_of(N.eqv(N.pi, N.makeComplex(N.pi))).should_be_false();
    },

    'complex / complex': function() {
	value_of(N.eqv(N.makeComplex(17, 2),
		       N.makeComplex(17, 2))).should_be_true();
	value_of(N.eqv(N.makeComplex(17, 2),
		       N.makeComplex(2, 17))).should_be_false();
	value_of(N.eqv(N.makeComplex(17, 2),
		       N.makeComplex(17, 17))).should_be_false();
	value_of(N.eqv(N.makeComplex(2, 17),
		       N.makeComplex(17, 17))).should_be_false();

 	value_of(N.eqv(N.makeComplex(N.makeFloat(100), 0),
 		       N.makeComplex(N.makeFloat(100), 0))).should_be_true();
 	value_of(N.eqv(N.makeComplex(N.makeFloat(100), 0),
 		       N.makeComplex(N.makeRational(100), 0))).should_be_false();
 	value_of(N.eqv(N.makeComplex(N.makeFloat(100.1), 0),
 		       N.makeComplex(N.makeRational(100), 0))).should_be_false();
 	value_of(N.eqv(N.makeComplex(N.makeFloat(100), 0),
 		       N.makeComplex(N.makeRational(100), 1))).should_be_false();
    }
});


describe('isSchemeNumber', {
    'strings': function() {
	value_of(N.isSchemeNumber("42")).should_be_false();
	value_of(N.isSchemeNumber(42)).should_be_true();
	value_of(N.isSchemeNumber(N.makeRational(42, 42))).should_be_true();
	value_of(N.isSchemeNumber(N.makeFloat(42.2))).should_be_true();
	value_of(N.isSchemeNumber(N.makeComplex(17))).should_be_true();
	value_of(N.isSchemeNumber(N.makeComplex(17, 1))).should_be_true();
	value_of(N.isSchemeNumber(N.makeComplex(N.makeFloat(17), 1))).should_be_true();
	value_of(N.isSchemeNumber(undefined)).should_be_false();
	value_of(N.isSchemeNumber(null)).should_be_false();
	value_of(N.isSchemeNumber(false)).should_be_false();
    }
});


describe('isFinite', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('isRational', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('isReal', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('isExact', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('isInteger', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('toFixnum', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('toFloat', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('toExact', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('toComplex', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('add', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('subtract', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('multiply', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('divide', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('greaterThanOrEqual', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('lessThanOrEqual', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('greaterThan', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('lessThan', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('expt', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('modulo', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('numerator', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('denominator', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('sqrt', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('abs', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('floor', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }

});


describe('ceiling', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('conjugate', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('magnitude', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('log', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('angle', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('atan', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('cos', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('sin', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});

describe('tan', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('acos', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('asin', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('imaginaryPart', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('realPart', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('round', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('exp', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('sqr', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});


describe('gcd', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('lcm', {
    'fixnum / fixnum' : function() {
    },
    'fixnum / rational' : function() {
    },
    'fixnum / floating' : function() {
    },
    'fixnum / complex' : function() {
    },
    'rational / rational' : function() {
    },
    'rational / floating' : function() {
    },
    'rational / complex' : function() {
    },
    'floating / floating' : function() {
    },
    'floating / complex' : function() {
    },
    'complex / complex' : function() {
    }
});


describe('integerSqrt', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});

describe('toString', {
    'fixnums': function() {
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    }
});
