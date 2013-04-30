exports.Log = function (domain) {
	var me = this;

	var 
		debug   = '\033[30;1;2m';
		log     = '\033[0m';
		warning = '\033[33m';
		error   = '\033[31m';
		reset   = '\033[0m';

	me.debug = function (msg) {
		if (msg !== null) console.info( debug   + domain + ': ' + msg + reset);
	}
	
	me.log = function (msg) {
		if (msg !== null) console.log(  info    + domain + ': ' + msg + reset);
	}

	me.warning = function (msg) {
		if (msg !== null) console.warn( warning + domain + ': ' + msg + reset);
	}

	me.error = function (msg) {
		if (msg !== null) console.error(error   + domain + ': '+msg + reset);
	}

	return me;
}

