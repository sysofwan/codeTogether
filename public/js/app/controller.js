app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, codeEditorService) {
	'use strict'
	codeEditorService.init();
	$scope.languages = ['C++', 'Javascript', 'Python', 'Java', 'Go', 'HTML', 'Haskell', 'Scheme', 'Perl',
						'Jade', 'Matlab', 'C#', 'LaTeX', 'Ruby', 'PHP', 'prolog', 'Pascal', 'Objective-C'];
	$scope.title = codeEditorService.getTitle();
	$scope.selected = codeEditorService.getLanguage();

	$scope.languageChanged = function() {
		codeEditorService.setLanguage($scope.selected);
	};
});

app.controller('NavController', function($scope, $location, $modal, codeEditorService) {
	$scope.createFile = function() {
		$location.url('/code/' + $scope.filename);
	};
	$scope.title = codeEditorService.getTitle();
	$scope.openModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/partials/uploadModal.html',
			controller: 'ModalInstanceController'
		});
	};
	$scope.openGithubModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/partials/githubLoginModal.html',
			controller: 'GithubLoginModalController'
		});
	};

	$scope.download = function() {
		$scope.content = codeEditorService.getValue();
		var strWindowFeatures = "menubar=yes";
        var content = $scope.content;
        uriContent = "data:text/plain," + encodeURIComponent(content);
        newWindow=window.open(uriContent, "codeSave.txt", strWindowFeatures);

	};
});

app.controller('ModalInstanceController', function($scope, $modalInstance, codeEditorService) {
	$scope.loadEditor = function(newContent) {
		codeEditorService.setValue(newContent);
		$modalInstance.dismiss('done');
	};
});

app.controller('GithubLoginModalController', function($scope, $modal, $modalInstance, gitHubService) {
	$scope.user = {name : '', pass : ''};
	$scope.dismiss = function() {
		$modalInstance.dismiss('done');
	}
	$scope.login = function() {
		gitHubService.authorize($scope.user.name, $scope.user.pass, function() {
			$modalInstance.dismiss('done');
			var modalInstance = $modal.open({
				templateUrl: '/partials/githubListModal.html',
				controller: 'GithubRepoModalChooser'
			});
		});
	};
});

app.controller('GithubRepoModalChooser', function($scope, $modal, $modalInstance, gitHubService, codeEditorService) {
	$scope.title = 'Choose a repo';
	$scope.firstCol = 'Name';
	$scope.secondCol = '';
	var repo = '';

	gitHubService.getAllRepos(function(data) {
		$scope.contents = data;
	});

	$scope.select = function(content) {
		$scope.title = 'Choose a file';
		repo = repo || content.name;
		if (content.type !== 'file') {
			path = content.path || '';
			gitHubService.getRepoContents(repo, path, function(data) {
				$scope.contents = data;
			});
		}
		else {
			gitHubService.getRawContent(repo, content.path, function(data) {
				codeEditorService.setValue(data);
				$modalInstance.dismiss('done');
			});
		}
	};
	$scope.dismiss = function() {
		$modalInstance.dismiss('done');
	};
});