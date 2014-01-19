app.service('codeEditorService', function ($routeParams, localStorageService) {
	var editor;
	var title;
	var langKey;
	var language;
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
		title = $routeParams.title;
		langKey = 'lang-' + title;
		language = localStorageService.get(langKey);
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
		},
		init: function() {
			init();
		}
	};
});

app.service('gitHubService', function($http) {
	var requestUrl = 'https://api.github.com/';
	var username;
	var password;
	var isAuthorized = false;
	var basicAuthEncode = function() {
		return btoa(username + ':' + password);
	};
	var authorizeUser = function() {
		$http.get(requestUrl)
			.success(function(data) {
				if (data.message !== 'Bad credentials') {
					isAuthorized = true;
				}
			})
	};
	return {
		setUser: function(name, pass) {
			username = name;
			password = pass;
			var base64auth = basicAuthEncode();
			$http.defaults.headers.common.Authentication = 'Basic ' + base64auth;
			authorizeUser(); 
		}, 
		isUserAutherized: function() {
			return isAuthorized;
		}
	};
});