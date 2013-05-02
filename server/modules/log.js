exports.Log = function (domain) {
	var me = this;

	var 
		debug   = '\033[30;1;2m';
		log     = '\033[0m';
		warning = '\033[33m';
		error   = '\033[31m';
		reset   = '\033[0m';

	var output = function (msg, prefix, func) {
		if (msg !== null) {
			var msgType = getDataType(msg);
			var text = '';
			switch (msgType) {
				case '[object String]': text = msg; break;
				case '[object Array]': text = '['+msg.join(',')+']'; break;
				case '[object Object]':
					text = [];
					msg.each( function (k, v) {
						if (getDataType(v) == '[object Function]') v = '[object Function]';
						text.push( k + ':' + v );
					});
					text = '{' + text.join(', ') + '}';
				break;
				case '[object Error]': text = '(Error) '+msg; break;
				case '[object Undefined]': text = 'Undefined'; break;
				default:
					text = 'UNKNOWN DATA TYPE: '+msgType;
			}
			func(prefix + domain + ': ' + text + reset);
		}
	}

	me.debug = function (msg) {
		output(msg, debug, console.info);
	}
	
	me.log = function (msg) {
		output(msg, log, console.log);
	}

	me.warning = function (msg) {
		output(msg, warning, console.warn);
	}

	me.error = function (msg) {
		output(msg, error, console.error);
	}

	return me;
}

Object.prototype.each = function (func) {
	for (var i in this) func(i, this[i]);
}

var getDataType = function (obj) {
	return Object.prototype.toString.call(obj);
}
