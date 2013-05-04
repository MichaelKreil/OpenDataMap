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

	$('#menu').tab();

	$('#menu a').click(function () {
		$(this).tab('show');
	});

	$('#btnTopics').click(function () {
		getTreeData('topics');
	});

	$('#btnInstitutions').click(function () {
		getTreeData('institutions');
	});

	$('#btnRelations').click(function () {
		getListData('relations');
	});

	$('#btnTopics').trigger('click');
});

function getTreeData(newPath) {
	path = newPath;
	apiGet(path + '/new/tree', function (newData) {
		data = newData;
		updateTree();
	})
}


function getListData(newPath) {
	path = newPath;
	apiGet(path + '/new', function (newData) {
		data = newData;
		updateList();
	})
}