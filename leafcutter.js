angular.module('leafcutter', [])
	.directive('leaflet', function(leafcutterdata) {
		return {
			restrict: "E",
			replace: true,
			scope: {
				view: '=?',
				options: '=?'
			},
			transclude: false,
			template: '<div class="leafcutter"></div>',
			controller: ["$scope", function ($scope) {
			}],
			link: function(scope, element, attrs, controller) {
				
				var default_view = {
					lon: 10, 
					lat: 30, 
					zoom: 2
				};

				var default_options = {
					attributionControl: false
				};

				scope.view = angular.extend(default_view, scope.view);
				scope.options = angular.extend(default_options, scope.options);

				if (!angular.isDefined(scope.options.layers)) {
					scope.options.layers = [L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {})];
				}

				scope.map = L.map(element[0], scope.options);
				scope.map.setView([scope.view.lat, scope.view.lon], scope.view.zoom);

				leafcutterdata.setMap(attrs.id, scope.map);

				scope.$on('$destroy', function () {
					leafcutterdata.reset();
				});

			}
		}
	});

angular.module('leafcutter').service('leafcutterdata', function($q) {

	var maps = {};

	this.setMap  = function(id, map) {
		if (maps.hasOwnProperty(id)) {
			maps[id].resolve(map);
		} else {
			var deferred = $q.defer();
			deferred.resolve(map);
			maps[id] = deferred;
		}
	};

	this.getMap = function(id) {
		if (!maps.hasOwnProperty(id)) {
			var deferred = $q.defer();
			maps[id] = deferred;
		}
		return maps[id].promise;
	};

	this.reset = function() {
		maps = {};
	};

});