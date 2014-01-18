app.service('codeEditorService', function ($routeParams, localStorageService) {
	var editor;
	var title = $routeParams.title;
	var langKey = 'lang-' + title;
	var language = localStorageService.get(langKey);
	var getRecognizedLanguage = function() {
		tempLang = language.toLowerCase();
		if (tempLang === 'c++') {
			tempLang = 'c_cpp';
		}
		else if (tempLang === 'c#') {
			tempLang = 'csharp';
		}
		else if (tempLang === 'go') {
			tempLang = 'golang';
		}
		return tempLang;
	};
	var setLanguage = function(newLanguage) {
		language = newLanguage;
		inputLang = getRecognizedLanguage();
		inputLang = 'ace/mode/' + inputLang;
		editor.getSession().setMode(inputLang);
		localStorageService.add(langKey, language);
	}
	var init = function() {
		ace.require("ace/ext/language_tools");
		editor = ace.edit('editor');
		editor.setTheme("ace/theme/monokai");
		editor.setShowPrintMargin(false);
		editor.focus();

		editor.setOptions({
    		enableBasicAutocompletion: true,
    	 	enableSnippets: true
		});
		sharejs.open(title, 'text', function(error, doc) {
			doc.attach_ace(editor);
		});
		if (language) {
			setLanguage(language);
		}
	};

	init();

	return {
		getValue: function() {
			return editor.getValue();
		},
		setValue: function(newVal) {
			editor.setValue(newVal);
		},
		getLanguage: function() {
			return language;
		},
		setLanguage: function(newLanguage) {
			setLanguage(newLanguage);
		},
		getTitle: function() {
			return title;
		}
	};
});