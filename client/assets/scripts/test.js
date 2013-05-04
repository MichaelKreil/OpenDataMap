var odm = {
	api: 'http://127.0.0.1:7001/api/'
};

var path = 'topics';

$(function () {
	$('#save').click(function () {
		apiPost(path, topics, function () {
			$('#savecheckmark').show().delay(1000).fadeOut(500);
		});
	});

	apiGet(path+'/new/tree', function (data) {
		topics = data;
		updateTree();
	})
});