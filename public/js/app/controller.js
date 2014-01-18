app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, $routeParams, codeEditorService) {
	'use strict'
	$scope.languages = ['C++', 'Javascript', 'Python', 'Java', 'Go', 'HTML', 'Haskell', 'Scheme', 'Perl',
						'Jade', 'Matlab', 'C#', 'LaTeX', 'Ruby', 'PHP', 'prolog', 'Pascal', 'Objective-C'];
	$scope.title = codeEditorService.getTitle();
	$scope.selected = codeEditorService.getLanguage();
	$scope.languageChanged = function() {
		codeEditorService.setLanguage($scope.selected);
	};
});

app.controller('NavController', function($scope, $location, $modal) {
	$scope.createFile = function() {
		$location.url('/code/' + $scope.filename);
	};
	$scope.openModal = function() {
		var modalInstance = $modal.open({
			templateUrl: '/partials/uploadModal.html',
			controller: 'ModalInstanceController'
		});
	}
});

app.controller('ModalInstanceController', function($scope, $modalInstance, codeEditorService) {
	$scope.loadEditor = function(newContent) {
		codeEditorService.setValue(newContent);
		$modalInstance.dismiss('done');
	};
});