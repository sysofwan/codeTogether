app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, $routeParams) {
	'use strict'
	$scope.languages = ['C++', 'Javascript', 'Python', 'Java', 'Go', 'HTML', 'Haskell', 'Scheme', 'Perl',
						'Jade', 'Matlab', 'C#', 'LaTeX', 'Ruby', 'PHP', 'prolog', 'Pascal', 'Objective-C'];
	$scope.selected = undefined;
	$scope.inputLanguage = undefined;
	$scope.title = $routeParams.title;
	$scope.languageChanged = function() {
		$scope.inputLanguage = $scope.selected;
	};
});
