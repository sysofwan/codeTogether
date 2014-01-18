app.directive('liveEdit', function() {
	var link = function(scope, element, attrs) {
		var editor = ace.edit(element.attr('id'));
		sharejs.open(attrs.liveEdit, 'text', function(error, doc) {
			doc.attach_ace(editor);
		});
	};
	return {
        link : link
    };
})