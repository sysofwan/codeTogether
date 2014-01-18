app.directive('liveEdit', function() {
	var toRecognizedLanguage = function(language) {
		language = language.toLowerCase();
		if (language === 'c++') {
			language = 'c_cpp';
		}
		else if (language === 'c#') {
			language = 'csharp';
		}
		else if (language === 'go') {
			language = 'golang';
		}
		return language;
	};
	var link = function(scope, element, attrs) {
		var editor = ace.edit(element.attr('id'));
		editor.setTheme("ace/theme/monokai");
		editor.setShowPrintMargin(false);
		editor.focus();

		sharejs.open(scope.title, 'text', function(error, doc) {
			doc.attach_ace(editor);
		});

		scope.$watch('inputLanguage', function(newLanguage) {
			console.log('called');
			if (newLanguage) {
				newLanguage = toRecognizedLanguage(newLanguage);
				newLanguage = 'ace/mode/' + newLanguage;
				editor.getSession().setMode(newLanguage);
			}
		});
	};
	return {
        link : link
    };
})