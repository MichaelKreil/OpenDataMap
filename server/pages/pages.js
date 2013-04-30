exports.Pages = function () {
	var me = this;

	var getPageDefinition = function (path) {
		var page = {
			"menu": [
				{ "title": "Wünsche",  "path": "" },
				{ "title": "Sektoren", "path": "sektor" },
				{ "title": "Daten",    "path": "daten" },
				{ "title": "Über",     "path": "about" }
			]
		}
	}

	me.getFrontPage() {

	}

	return me;
}


frontpage.content = [
	wishes,
	sektoren,
	daten
]

