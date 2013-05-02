var odm = {
	api: 'http://127.0.0.1:7001/api/'
};

$(function () {
	$('#save').click(function () {
		apiPost('topics', topics);
	});

	apiGet('topics/new/tree', function (data) {
		topics = data;
		updateTree();
	})
});