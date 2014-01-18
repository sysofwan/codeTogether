app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, $routeParams) {
	'use strict'
	console.log($routeParams.title);
	$scope.title = $routeParams.title;
});