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
	var observerCallbacks = [];
	var basicAuthEncode = function() {
		return btoa(username + ':' + password);
	};
	var getContentUrl = function(repo, path) {
		path = path || '';
		return requestUrl + 'repos/' + repo.owner.login + '/' + repo.name + '/contents/' + path;
	};

	var notifyObservers = function(){
    	angular.forEach(observerCallbacks, function(callback){
      		callback();
    	});
  	};

	var currentFile = {};

	var authorizeUser = function(successCallback, failureCallback) {
		$http.get(requestUrl)
			.success(function(data) {
				isAuthorized = true;
				successCallback();
			})
			.error(function(data) {
				failureCallback();
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
	var getRawContent = function(repo, content, callback) {
		var url = getContentUrl(repo, content.path);
		$http.get(url, {headers: {Accept: 'application/vnd.github.VERSION.raw'}})
			.success(function(data) {
				callback(data);
				currentFile.repo = repo;
				currentFile.content = content;
				notifyObservers();
			});
	};
	var commit = function(newContent, message, callback) {
		var url = requestUrl + 'repos/' + currentFile.repo.owner.login + '/' + currentFile.repo.name + '/contents/' + currentFile.content.path;
		var data = {
			path: currentFile.content.path,
			message: message,
			content: btoa(newContent),
			sha: currentFile.content.sha,
		};
		$http.put(url, data)
			.success(function(data) {
				currentFile.content = data.content;
				if (callback) {
					callback(data);
				}
			});
	};
	return {
		authorize: function(name, pass, successCallback, failureCallback) {
			username = name;
			password = pass;
			var base64auth = basicAuthEncode();
			$http.defaults.headers.common.Authorization = 'Basic ' + base64auth;
			authorizeUser(successCallback, failureCallback); 
		}, 
		isUserAutherized: function() {
			return isAuthorized;
		},
		isUsingGithubFile: function() {
			return currentFile.repo;
		},
		getAllRepos: function(callback) {
			getUserRepos(callback);
		},
		getRepoContents: function(repo, path, callback) {
			getContents(repo, path, callback);
		},
		getRawContent: function(repo, path, sha, callback) {
			getRawContent(repo, path, sha, callback);
		},
		registerCallbacks: function(callback) {
			observerCallbacks.push(callback);
		},
		invalidate: function() {
			currentFile = {};
			notifyObservers();
		},
		commit: function(newContent, message, callback) {
			commit(newContent, message, callback);
		},
		logout: function() {
			isAuthorized = false;
			username = '';
			password = '';
			this.invalidate();
		}
	};
});