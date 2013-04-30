var templates = {
	content: function (config, parameters) {
		var result = [];
		switch (parameters.contentType) {
			case 'wishes':
				result.push('<div class="wishes">');
				var wishes = parameters.wishes;
				for (var i = 0; i < wishes.length; i++) {
					result.push(TE.evaluate('wish', wishes[i]));
				}
				result.push('</div>');
			break;
			default:
				return false;
		}
		return result.join('');
	},
	wish: function (config, wish) {
		return '<div>'
	}
}