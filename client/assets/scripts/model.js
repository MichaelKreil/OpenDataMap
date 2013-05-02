var topics;


var apiGet = function (url, callback) {
	$.ajax(odm.api + url, {
		success: callback
	})
}


var apiPost = function (url, data, callback) {
	data = JSON.stringify(data);

	$.ajax(odm.api + url, {
		data: data,
		type: 'POST',
		success: callback
	})
}


