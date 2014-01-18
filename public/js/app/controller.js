app.controller('FrontPageController', function($scope) {
	'use strict'

});

app.controller('CodeEditController', function($scope, $routeParams) {
	'use strict'
	$scope.title = $routeParams.title;
});