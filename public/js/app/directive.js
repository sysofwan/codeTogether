app.directive('useFile', function($routeParams) {
	var link = function(scope, element, attrs) {
		var callback = scope.loadEditor;
		var opts = {
		readAsDefault: 'Text',
		dragClass: 'modal-text-droppable',
		on : {
			load: function(e, file) {
				var result = e.target.result;
				callback(result);
				}
			}
		};
		var jqElt = $(element[0]);
		jqElt.fileReaderJS(opts);
	}
	return link;
});