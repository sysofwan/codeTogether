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
		ace.require("ace/ext/language_tools");
		var editor = ace.edit(element.attr('id'));
		editor.setTheme("ace/theme/monokai");
		editor.setShowPrintMargin(false);
		editor.focus();

		editor.setOptions({
    		enableBasicAutocompletion: true,
    	 	enableSnippets: true
		});

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
});

app.directive('useFile', function($routeParams) {
	var substituteDoc = function(newDoc) {
		var docName = $routeParams.title;
		sharejs.open(docName, 'text', function(error, doc) {
			var currTxtLen = doc.getText().length;
			doc.del(0, currTxtLen);
			doc.insert(0, newDoc);
		});
	};
	var link = function(scope, element, attrs) {
		var callback = scope.dismiss;
		var opts = {
		readAsDefault: 'Text',
		on : {
			load: function(e, file) {
				var result = e.target.result;
				substituteDoc(result);
				callback();
				}
			}
		};
		var jqElt = $(element[0]);
		jqElt.fileReaderJS(opts);
	}
	return link;
});