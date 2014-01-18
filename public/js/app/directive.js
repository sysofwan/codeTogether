app.directive('liveEdit', function() {
	var link = function(scope, element, attrs) {
		var editor = ace.edit(element.attr('id'));
		editor.setTheme("ace/theme/monokai");
		editor.focus();
		console.log(scope.title);

		sharejs.open(scope.title, 'text', function(error, doc) {
			doc.attach_ace(editor);
		});
	};
	return {
        link : link
    };
})