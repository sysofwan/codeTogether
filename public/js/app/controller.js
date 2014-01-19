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
	}

	$scope.download = function() {
		$scope.content = codeEditorService.getValue();
		var strWindowFeatures = "menubar=yes";
        var content = $scope.content;
        uriContent = "data:text/plain," + encodeURIComponent(content);
        newWindow=window.open(uriContent, "codeSave.txt", strWindowFeatures);

	}





});

app.controller('ModalInstanceController', function($scope, $modalInstance, codeEditorService) {
	$scope.loadEditor = function(newContent) {
		codeEditorService.setValue(newContent);
		$modalInstance.dismiss('done');
	};
});

app.controller('GitHubModalController', function($scope, $modal, $modalInstance, gitHubService) {

});