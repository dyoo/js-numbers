// See http://jania.pe.kr/aw/moin.cgi/JSSpec/Manual for definition
// of test case API.


// Let's open up plt.lib.Numbers to make it easy to test.
var N = plt.lib.Numbers;
for (val in N) {
    if (N.hasOwnProperty(val)) {
	this[val] = N[val];
    }
}



var assertTrue = function(aVal) {
    value_of(aVal).should_be_true();
}

var assertFalse = function(aVal) {
    value_of(aVal).should_be_false();
}

var assertEquals = function(expected, aVal) {
    value_of(aVal).should_be(expected);
}

var assertFails = function(thunk) {
    var isFailed = false;
    try {
	thunk(); 
    } catch (e) {
	isFailed = true;
    }
    value_of(isFailed).should_be_true();
}



describe('rational constructions', {
    'constructions' : function() { 
	value_of(isSchemeNumber(makeRational(42)))
	    .should_be_true(); 

	value_of(isSchemeNumber(makeRational(21, 2)))
	    .should_be_true(); 

	value_of(isSchemeNumber(makeRational(2, 1)))
	    .should_be_true(); 


	value_of(isSchemeNumber(makeRational(-17, -171)))
	    .should_be_true(); 

	value_of(isSchemeNumber(makeRational(17, -171)))
	    .should_be_true(); 
    },


    'reductions' : function() {
	value_of(equals(makeRational(1, 2),

			  makeRational(5, 10)))
	    .should_be_true();
	value_of(equals(makeRational(1, 2),

			  makeRational(6, 10)))

	value_of(equals(makeRational(1, 2),

			  makeRational(-1, -2)))
	    .should_be_true();
    }

});



describe('built-in constants', { 
    'pi': function() {
 	value_of(isSchemeNumber(pi)).should_be_true() },
    'e': function() {
	value_of(isSchemeNumber(e)).should_be_true() },
    'nan' : function() {
	value_of(isSchemeNumber(nan)).should_be_true() },
    'negative_inf' : function() {
	value_of(isSchemeNumber(negative_inf)).should_be_true() },
    'inf' : function() {
	value_of(isSchemeNumber(inf)).should_be_true() },
    'negative_one' : function() {
	value_of(isSchemeNumber(negative_one)).should_be_true() },
    'zero' : function() { 
	value_of(isSchemeNumber(zero)).should_be_true() },
    'one' : function() {
	value_of(isSchemeNumber(one)).should_be_true() },
    'i' : function() {
	value_of(isSchemeNumber(i)).should_be_true() },
    'negative_i' : function() {
	value_of(isSchemeNumber(negative_i)).should_be_true() }
});


describe('fromFixnum', {
    'fixnums': function() {
	value_of(equals(fromFixnum(42),
			  makeRational(42))).should_be_true();
	value_of(equals(fromFixnum("43"),
			  makeRational(43))).should_be_true();
	value_of(equals(fromFixnum("42"),
			  makeRational(43))).should_be_false();
    },
    'rationals': function() {
    },
    'floats': function() {
	value_of(equals(fromFixnum("42.1"),
			  makeFloat(42.1))).should_be_true();
    },
    'complex': function() {
    }
});



describe('equals', {
    'nan': function() {
	value_of(equals(nan, nan)).should_be_false();
    },

    'fixnum / fixnum': function() {
	value_of(equals(42, 42)).should_be_true();
	value_of(equals(42, 43)).should_be_false();
    },

    'fixnum / rational': function() {
	value_of(equals(0, zero)).should_be_true();
	value_of(equals(42, makeRational(84, 2))).should_be_true();
	value_of(equals(42, makeRational(84, 3))).should_be_false();
    },
    
    'fixnum / float ' : function() {
	value_of(equals(1024, makeFloat(1024))).should_be_true();
	value_of(equals(1024, makeFloat(1024.0001))).should_be_false();
    },

    'fixnum / complex ': function() {
	value_of(equals(31337, makeComplex(31337))).should_be_true();
	value_of(equals(31337, makeComplex(31337, 1))).should_be_false();
    },

    'rational / rational ' : function() {
	value_of(equals(makeRational(23849),
			  makeRational(23849))).should_be_true();
	value_of(equals(makeRational(23849),
			  makeRational(23489))).should_be_false();
    },

    'rational / float': function() {
	value_of(equals(makeRational(2),
			  makeFloat(2))).should_be_true();
	value_of(equals(makeRational(2),
			  makeFloat(2.1))).should_be_false();
    },

    'rational / complex': function() {
	value_of(equals(makeRational(2),
			  makeComplex(2, 0))).should_be_true();
	value_of(equals(makeRational(2),
			  makeComplex(2, 1))).should_be_false();
	value_of(equals(makeRational(2),
			  makeComplex(0, 0))).should_be_false();
    },

    'float / float': function() {
	value_of(equals(pi, pi)).should_be_true();
	value_of(equals(pi, e)).should_be_false();
    },

    'float / complex': function() {
	value_of(equals(pi, makeComplex(pi, 0))).should_be_true();
	value_of(equals(pi, makeComplex(e, 0))).should_be_false();
    },

    'complex / complex': function() {
	value_of(equals(makeComplex(17, 2),
			  makeComplex(17, 2))).should_be_true();
	value_of(equals(makeComplex(17, 2),
			  makeComplex(2, 17))).should_be_false();
	value_of(equals(makeComplex(17, 2),
			  makeComplex(17, 17))).should_be_false();
	value_of(equals(makeComplex(2, 17),
			  makeComplex(17, 17))).should_be_false();

	value_of(equals(makeComplex(makeFloat(100), 0),
			  makeComplex(makeFloat(100), 0))).should_be_true();
	value_of(equals(makeComplex(makeFloat(100), 0),
			  makeComplex(makeRational(100), 0))).should_be_true();
	value_of(equals(makeComplex(makeFloat(100.1), 0),
			  makeComplex(makeRational(100), 0))).should_be_false();
	value_of(equals(makeComplex(makeFloat(100), 0),
			  makeComplex(makeRational(100), 1))).should_be_false();
    }
});


describe('eqv', {
    'nan' : function() {
	value_of(eqv(nan,
		       makeFloat(Number.NaN))).should_be_true();
    },

    'inf' : function() {
	value_of(eqv(inf, inf)).should_be_true();
	value_of(eqv(negative_inf, negative_inf)).should_be_true();
    },


    'fixnum / fixnum': function() {
	value_of(eqv(42, 42)).should_be_true();
	value_of(eqv(42, 43)).should_be_false();
    },

    'fixnum / rational': function() {
	value_of(eqv(42, makeRational(84, 2))).should_be_false();
	value_of(eqv(42, makeRational(84, 3))).should_be_false();
    },
    
    'fixnum / float ' : function() {
	value_of(eqv(1024, makeFloat(1024))).should_be_false();
	value_of(eqv(1024, makeFloat(1024.0001))).should_be_false();
    },

    'fixnum / complex' : function() {
	value_of(eqv(10, makeComplex(10))).should_be_false();
	value_of(eqv(10, makeComplex(0))).should_be_false();
    },

    'rational / rational': function() {
	value_of(eqv(makeRational(2, 3),
		       makeRational(2, 3))).should_be_true();
	value_of(eqv(makeRational(3, 2),
		       makeRational(2, 3))).should_be_false();
    },

    'rational / float': function() {
	value_of(eqv(makeRational(2),
		       makeFloat(2))).should_be_false();
	value_of(eqv(makeRational(2),
		       makeFloat(2.1))).should_be_false();
    },

    'rational / complex': function() {
	value_of(eqv(makeRational(2),
		       makeComplex(2, 0))).should_be_false();
	value_of(eqv(makeRational(2),
		       makeComplex(2, 1))).should_be_false();
	value_of(eqv(makeRational(2),
		       makeComplex(0, 0))).should_be_false();
    },

    'float / float': function() {
	value_of(eqv(pi, pi)).should_be_true();
	value_of(eqv(e, e)).should_be_true();
	value_of(eqv(pi, e)).should_be_false();
    },

    'float / complex': function() {
	value_of(eqv(pi, makeComplex(pi))).should_be_false();
    },

    'complex / complex': function() {
	value_of(eqv(makeComplex(17, 2),
		       makeComplex(17, 2))).should_be_true();
	value_of(eqv(makeComplex(17, 2),
		       makeComplex(2, 17))).should_be_false();
	value_of(eqv(makeComplex(17, 2),
		       makeComplex(17, 17))).should_be_false();
	value_of(eqv(makeComplex(2, 17),
		       makeComplex(17, 17))).should_be_false();

 	value_of(eqv(makeComplex(makeFloat(100), 0),
 		       makeComplex(makeFloat(100), 0))).should_be_true();
 	value_of(eqv(makeComplex(makeFloat(100), 0),
 		       makeComplex(makeRational(100), 0))).should_be_false();
 	value_of(eqv(makeComplex(makeFloat(100.1), 0),
 		       makeComplex(makeRational(100), 0))).should_be_false();
 	value_of(eqv(makeComplex(makeFloat(100), 0),
 		       makeComplex(makeRational(100), 1))).should_be_false();
    }
});


describe('isSchemeNumber', {
    'strings': function() {
	value_of(isSchemeNumber("42")).should_be_false();
	value_of(isSchemeNumber(42)).should_be_true();
	value_of(isSchemeNumber(makeRational(42, 42))).should_be_true();
	value_of(isSchemeNumber(makeFloat(42.2))).should_be_true();
	value_of(isSchemeNumber(makeComplex(17))).should_be_true();
	value_of(isSchemeNumber(makeComplex(17, 1))).should_be_true();
	value_of(isSchemeNumber(makeComplex(makeFloat(17), 1))).should_be_true();
	value_of(isSchemeNumber(undefined)).should_be_false();
	value_of(isSchemeNumber(null)).should_be_false();
	value_of(isSchemeNumber(false)).should_be_false();
    }
});



describe('isRational', {
    'fixnums': function() {
	assertTrue(isRational(0));
	assertTrue(isRational(1));
	assertTrue(isRational(238977428));
	assertTrue(isRational(-2371));
    },

    'rationals': function() {
	assertTrue(isRational(makeRational(0, 1)));
	assertTrue(isRational(makeRational(1, 100)));
	assertTrue(isRational(makeRational(9999, 10000)));
	assertTrue(isRational(makeRational(1, 4232)));
    },

    'floats': function() {
 	assertTrue(isRational(makeFloat(1.0)));
 	assertTrue(isRational(makeFloat(25.0)));
 	assertTrue(isRational(e));
	assertTrue(isRational(pi));
	assertFalse(isRational(inf));
	assertFalse(isRational(negative_inf));
	assertFalse(isRational(nan));
    },

    'complex': function() {
	assertTrue(isRational(makeComplex(0, 0)));
	assertTrue(isRational(makeComplex(e, 0)));
	assertTrue(isRational(makeComplex(pi, 0)));
	assertFalse(isRational(makeComplex(nan, 0)));
	assertFalse(isRational(makeComplex(0, 1)));
	assertFalse(isRational(makeComplex(0, negative_inf)));
    },

    'others': function() {
	assertFalse(isRational("0"));
	assertFalse(isRational("hello"));
	assertFalse(isRational({}));
	assertFalse(isRational([]));
	assertFalse(isRational(false));
    },
});


describe('isReal', {
    'fixnums': function() {
	assertTrue(isReal(237489));
	assertTrue(isReal(0));
	assertTrue(isReal(-12345));
    },

    'rationals': function() {
	assertTrue(isReal(makeRational(0, 1)));
	assertTrue(isReal(makeRational(0, 12342)));
	assertTrue(isReal(makeRational(-2324, 12342)));
	assertTrue(isReal(makeRational(1, 2)));
    },

    'floats': function() {
 	assertTrue(isReal(makeFloat(1.0)));
 	assertTrue(isReal(makeFloat(25.0)));
 	assertTrue(isReal(e));
	assertTrue(isReal(pi));
	assertTrue(isReal(inf));
	assertTrue(isReal(negative_inf));
	assertTrue(isReal(nan));
    },

    'complex': function() {
	assertTrue(isReal(makeComplex(0, 0)));
	assertTrue(isReal(makeComplex(e, 0)));
	assertTrue(isReal(makeComplex(pi, 0)));
	assertTrue(isReal(makeComplex(nan, 0)));
	assertTrue(isReal(makeComplex(inf, 0)));
	assertTrue(isReal(makeComplex(negative_inf, 0)));
	assertFalse(isReal(makeComplex(0, 1)));
	assertFalse(isReal(makeComplex(0, negative_inf)));
	assertFalse(isReal(makeComplex(pi, inf)));
	assertFalse(isReal(makeComplex(234, nan)));
    },

    'others': function() {
	assertFalse(isReal("0"));
	assertFalse(isReal("hello"));
	assertFalse(isReal([]));
	assertFalse(isReal({}));
	assertFalse(isReal(false));
    }
});


describe('isExact', {
    'fixnums': function() {
	assertTrue(isExact(19));	
	assertTrue(isExact(0));
	assertTrue(isExact(-1));
	assertTrue(isExact(1));
    },

    'rationals': function() {
	assertTrue(isExact(makeRational(19)));	
	assertTrue(isExact(makeRational(0)));
	assertTrue(isExact(makeRational(-1)));
	assertTrue(isExact(makeRational(1)));
	assertTrue(isExact(makeRational(1, 2)));
	assertTrue(isExact(makeRational(1, 29291)));
    },

    'floats': function() {
	assertFalse(isExact(e));
	assertFalse(isExact(pi));
	assertFalse(isExact(inf));
	assertFalse(isExact(negative_inf));
	assertFalse(isExact(nan));
	assertFalse(isExact(makeFloat(0)));
	assertFalse(isExact(makeFloat(1111.1)));
    },

    'complex': function() {
	assertTrue(isExact(makeComplex(0, 0)));
	assertTrue(isExact(makeComplex(makeRational(1,2),
					   makeRational(1, 17))));
	assertFalse(isExact(makeComplex(e,
					    makeRational(1, 17))));
	assertFalse(isExact(makeComplex(makeRational(1,2),
					    pi)));
	assertFalse(isExact(makeComplex(makeRational(1,2),
					    nan)));

	assertFalse(isExact(makeComplex(negative_inf,
					    nan)));
    }
});


describe('isInteger', {
    'fixnums': function() {
	assertTrue(isInteger(1));
	assertTrue(isInteger(-1));
    },

    'rationals': function() {
	assertTrue(isInteger(makeRational(1, 1)));
	assertFalse(isInteger(makeRational(1, 2)));
	assertFalse(isInteger(makeRational(9999, 10000)));
	assertFalse(isInteger(makeRational(9999, 1000)));
    },

    'floats': function() {
	assertFalse(isInteger(makeFloat(2.3)));
	assertTrue(isInteger(makeFloat(4.0)));
	assertFalse(isInteger(inf));
	assertFalse(isInteger(negative_inf));
	assertFalse(isInteger(nan));
    },

    'complex': function() {
	assertTrue(isInteger(makeComplex(42, 0)));
	assertFalse(isInteger(makeComplex(42, 42)));
	assertFalse(isInteger(i));
	assertFalse(isInteger(negative_i));
    },

    'others': function() {
	assertFalse(isInteger("hello"));
	assertFalse(isInteger("0"));
    }
});


describe('toFixnum', {
    'fixnums': function() {
	assertEquals(42, toFixnum(42));
	assertEquals(-20, toFixnum(-20));
	assertEquals(0, toFixnum(0));
    },

    'rationals': function() {
	assertEquals(0, toFixnum(zero));
	assertEquals(17/2, toFixnum(makeRational(17, 2)));
	assertEquals(1926/3, toFixnum(makeRational(1926, 3)));
	assertEquals(-11150/17, toFixnum(makeRational(-11150, 17)));
    },

    'floats': function() {
	assertEquals(12345.6789, toFixnum(makeFloat(12345.6789)));
	assertEquals(Math.PI, toFixnum(pi));
	assertEquals(Math.E, toFixnum(e));
	assertEquals(Number.POSITIVE_INFINITY, toFixnum(inf));
	assertEquals(Number.NEGATIVE_INFINITY, toFixnum(negative_inf));
	assertTrue(isNaN(toFixnum(nan)));
    },

    'complex': function() {
	assertFails(function() { toFixnum(makeComplex(2, 1)) });
	assertFails(function() { toFixnum(i) });
	assertFails(function() { toFixnum(negative_i) });
	assertEquals(2, toFixnum(makeComplex(2, 0)));
	assertEquals(1/2, toFixnum(makeComplex(makeRational(1, 2),
						   0)));
	assertEquals(Number.POSITIVE_INFINITY,
		     toFixnum(makeComplex(inf, 0)));

	assertEquals(Number.NEGATIVE_INFINITY,
		     toFixnum(makeComplex(negative_inf, 0)));
	assertTrue(isNaN(toFixnum(makeComplex(nan, 0))));

    }
});



describe('toExact', {
    'fixnums': function() {
	assertEquals(1792, toExact(1792));
	assertEquals(0, toExact(0));
	assertEquals(-1, toExact(-1));
    },

    'rationals': function() {
	assertEquals(makeRational(1, 2), toExact(makeRational(1, 2)));
	assertEquals(makeRational(1, 9999), toExact(makeRational(1, 9999)));
	assertEquals(makeRational(0, 1), toExact(makeRational(0, 9999)));
	assertEquals(makeRational(-290, 1), toExact(makeRational(-290, 1)));
    },

    'floats': function() {
	assertEquals(makeRational(1, 2), toExact(makeFloat(0.5)));
	assertEquals(-1, toExact(makeFloat(-1)));
	assertEquals(0, toExact(makeFloat(0)));	
	assertEquals(1024, toExact(makeFloat(1024)));
	assertFails(function() { toExact(nan); });
	assertFails(function() { toExact(inf); });
	assertFails(function() { toExact(negative_inf); });
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

