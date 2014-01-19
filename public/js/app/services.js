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
	var getContentUrl = function(repo, path) {
		path = path || '';
		return requestUrl + 'repos/' + username + '/' + repo + '/contents/' + path;
	};

	var authorizeUser = function(callback) {
		$http.get(requestUrl)
			.success(function(data) {
				if (data.message !== 'Bad credentials') {
					isAuthorized = true;
					callback();
				}
			});
	};
	var getUserRepos = function(callback) {
		$http.get(requestUrl + 'user/repos')
			.success(function(data) {
				callback(data);
			});
	};

	var getContents = function(repo, path, callback) {
		var url = getContentUrl(repo, path);
		$http.get(url)
			.success(function(data) {
				callback(data);
			});
	}
	var getRawContent = function(repo, path, callback) {
		var url = getContentUrl(repo, path);
		$http.get(url, {headers: {Accept: 'application/vnd.github.VERSION.raw'}})
			.success(function(data) {
				callback(data);
			});
	};
	return {
		authorize: function(name, pass, callback) {
			username = name;
			password = pass;
			var base64auth = basicAuthEncode();
			$http.defaults.headers.common.Authorization = 'Basic ' + base64auth;
			authorizeUser(callback); 
		}, 
		isUserAutherized: function() {
			return isAuthorized;
		},
		getAllRepos: function(callback) {
			getUserRepos(callback);
		},
		getRepoContents: function(repo, path, callback) {
			getContents(repo, path, callback);
		},
		getRawContent: function(repo, path, callback) {
			getRawContent(repo, path, callback);
		}
	};
});