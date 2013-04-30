exports.Server = function () {
	var me = this;
	
	var log = new (require('./log.js').Log)('HTTP Server');

	log.debug('Starting');
	log.debug('Started');

	me.stop = function () {

		log.debug('Stopping');
		log.debug('Stopped');		
	}


	return me;
}