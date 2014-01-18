app.directive('liveEdit', function() {
	var link = function(scope, element, attrs) {
		ace.require("ace/ext/language_tools");
		var editor = ace.edit(element.attr('id'));
		editor.setTheme("ace/theme/monokai");
		editor.setShowPrintMargin(false);
		editor.focus();
		console.log(scope.title);
		editor.setOptions({
    	enableBasicAutocompletion: true,
    	 enableSnippets: true
		});

		sharejs.open(scope.title, 'text', function(error, doc) {
			doc.attach_ace(editor);
		});
	};
	return {
        link : link
    };
})