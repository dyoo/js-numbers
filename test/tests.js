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



describe('equals', {
    'nan': function() {
	value_of(N.equals(N.nan, N.nan)).should_be_false();
    },

    'fixnum / fixnum': function() {
	value_of(N.equals(42, 42)).should_be_true();
	value_of(N.equals(42, 43)).should_be_false();
    },

    'fixnum / rational': function() {
	value_of(N.equals(0, N.zero)).should_be_true();
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


var assertTrue = function(aVal) {
    value_of(aVal).should_be_true();
}

var assertFalse = function(aVal) {
    value_of(aVal).should_be_false();
}


describe('isRational', {
    'fixnums': function() {
	assertTrue(N.isRational(0));
	assertTrue(N.isRational(1));
	assertTrue(N.isRational(238977428));
	assertTrue(N.isRational(-2371));
    },
    'rationals': function() {
	assertTrue(N.isRational(N.makeRational(0, 1)));
	assertTrue(N.isRational(N.makeRational(1, 100)));
	assertTrue(N.isRational(N.makeRational(9999, 10000)));
	assertTrue(N.isRational(N.makeRational(1, 4232)));
    },
    'floats': function() {
 	assertTrue(N.isRational(N.makeFloat(1.0)));
 	assertTrue(N.isRational(N.makeFloat(25.0)));
 	assertTrue(N.isRational(N.e));
	assertTrue(N.isRational(N.pi));
	assertFalse(N.isRational(N.inf));
	assertFalse(N.isRational(N.negative_inf));
	assertFalse(N.isRational(N.nan));
    },
    'complex': function() {
	assertTrue(N.isRational(N.makeComplex(0, 0)));
	assertTrue(N.isRational(N.makeComplex(N.e, 0)));
	assertTrue(N.isRational(N.makeComplex(N.pi, 0)));
	assertFalse(N.isRational(N.makeComplex(N.nan, 0)));
	assertFalse(N.isRational(N.makeComplex(0, 1)));
	assertFalse(N.isRational(N.makeComplex(0, N.negative_inf)));
    },

    'others': function() {
	assertFalse(N.isRational("0"));
	assertFalse(N.isRational("hello"));
	assertFalse(N.isRational({}));
	assertFalse(N.isRational([]));
	assertFalse(N.isRational(false));
    },
});


describe('isReal', {
    'fixnums': function() {
	assertTrue(N.isReal(237489));
	assertTrue(N.isReal(0));
	assertTrue(N.isReal(-12345));
    },

    'rationals': function() {
	assertTrue(N.isReal(N.makeRational(0, 1)));
	assertTrue(N.isReal(N.makeRational(0, 12342)));
	assertTrue(N.isReal(N.makeRational(-2324, 12342)));
	assertTrue(N.isReal(N.makeRational(1, 2)));
    },

    'floats': function() {
 	assertTrue(N.isReal(N.makeFloat(1.0)));
 	assertTrue(N.isReal(N.makeFloat(25.0)));
 	assertTrue(N.isReal(N.e));
	assertTrue(N.isReal(N.pi));
	assertTrue(N.isReal(N.inf));
	assertTrue(N.isReal(N.negative_inf));
	assertTrue(N.isReal(N.nan));
    },

    'complex': function() {
	assertTrue(N.isReal(N.makeComplex(0, 0)));
	assertTrue(N.isReal(N.makeComplex(N.e, 0)));
	assertTrue(N.isReal(N.makeComplex(N.pi, 0)));
	assertTrue(N.isReal(N.makeComplex(N.nan, 0)));
	assertTrue(N.isReal(N.makeComplex(N.inf, 0)));
	assertTrue(N.isReal(N.makeComplex(N.negative_inf, 0)));
	assertFalse(N.isReal(N.makeComplex(0, 1)));
	assertFalse(N.isReal(N.makeComplex(0, N.negative_inf)));
	assertFalse(N.isReal(N.makeComplex(N.pi, N.inf)));
	assertFalse(N.isReal(N.makeComplex(234, N.nan)));
    },

    'others': function() {
	assertFalse(N.isReal("0"));
	assertFalse(N.isReal("hello"));
	assertFalse(N.isReal([]));
	assertFalse(N.isReal({}));
	assertFalse(N.isReal(false));
    }
});


describe('isExact', {
    'fixnums': function() {
	assertTrue(N.isExact(19));	
	assertTrue(N.isExact(0));
	assertTrue(N.isExact(-1));
	assertTrue(N.isExact(1));
    },

    'rationals': function() {
	assertTrue(N.isExact(N.makeRational(19)));	
	assertTrue(N.isExact(N.makeRational(0)));
	assertTrue(N.isExact(N.makeRational(-1)));
	assertTrue(N.isExact(N.makeRational(1)));
	assertTrue(N.isExact(N.makeRational(1, 2)));
	assertTrue(N.isExact(N.makeRational(1, 29291)));
    },

    'floats': function() {
	assertFalse(N.isExact(N.e));
	assertFalse(N.isExact(N.pi));
	assertFalse(N.isExact(N.inf));
	assertFalse(N.isExact(N.negative_inf));
	assertFalse(N.isExact(N.nan));
	assertFalse(N.isExact(N.makeFloat(0)));
	assertFalse(N.isExact(N.makeFloat(1111.1)));
    },

    'complex': function() {
	assertTrue(N.isExact(N.makeComplex(0, 0)));
	assertTrue(N.isExact(N.makeComplex(N.makeRational(1,2),
					   N.makeRational(1, 17))));
	assertFalse(N.isExact(N.makeComplex(N.e,
					    N.makeRational(1, 17))));
	assertFalse(N.isExact(N.makeComplex(N.makeRational(1,2),
					    N.pi)));
	assertFalse(N.isExact(N.makeComplex(N.makeRational(1,2),
					    N.nan)));

	assertFalse(N.isExact(N.makeComplex(N.negative_inf,
					    N.nan)));
    }
});


describe('isInteger', {
    'fixnums': function() {
	assertTrue(N.isInteger(1));
	assertTrue(N.isInteger(1));
    },
    'rationals': function() {
    },
    'floats': function() {
    },
    'complex': function() {
    },
    'others': function() {
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
