app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, $routeParams, localStorageService) {
	'use strict'
	$scope.languages = ['C++', 'Javascript', 'Python', 'Java', 'Go', 'HTML', 'Haskell', 'Scheme', 'Perl',
						'Jade', 'Matlab', 'C#', 'LaTeX', 'Ruby', 'PHP', 'prolog', 'Pascal', 'Objective-C'];
	$scope.title = $routeParams.title;
	var langKey = 'lang-' + $scope.title;
	$scope.inputLanguage = localStorageService.get(langKey);
	$scope.selected = $scope.inputLanguage;
	$scope.languageChanged = function() {
		$scope.inputLanguage = $scope.selected;
		localStorageService.add(langKey, $scope.inputLanguage);
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

app.controller('ModalInstanceController', function($scope, $modalInstance) {
	$scope.dismiss = function() {
		$modalInstance.dismiss('done');
	};
});