var odm = {
	api: 'http://127.0.0.1:7001/api/'
};

var path, data;

$(function () {
	$('#save').click(function () {
		apiPost(path, data, function () {
			$('#savecheckmark').show().delay(1000).fadeOut(500);
		});
	});

	$('#menu').tab();

	$('#menu a').click(function () {
		$(this).tab('show');
	});

	$('#btnTopics').click(function () {
		path = 'topics';
		data = topics;
		updateTree();
	});

	$('#btnInstitutions').click(function () {
		path = 'institutions';
		data = institutions;
		updateTree();
	});

	$('#btnRelations').click(function () {
		path = 'relations';
		data = relations;
		updateList();
	});

	apiStart(function () {
		$('#btnTopics').trigger('click');
	})
});
