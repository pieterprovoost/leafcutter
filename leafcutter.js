var leafcutter = angular.module("leafcutter", []);

leafcutter.directive("leaflet", function(leafcuttermaps) {
	return {
		restrict: "EA",
		scope: {
			name: "="
        },
		link: function(scope, element, attrs) {
			scope.layers = [];
			scope.map = L.map(element[0], {
				attributionControl: false
			}).setView([30, 20], 2);
			L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {}).addTo(scope.map);
			leafcuttermaps.setMap(attrs.map, {
				map: scope.map,
				addlayer: function(layer) {
					layer.addTo(scope.map);
					scope.layers.push(layer);
				},
				reset: function() {
					for (l in scope.layers) {
						scope.map.removeLayer(scope.layers[l]);
					}
					scope.layers = [];
				}
			});
			scope.$on('$destroy', function () {
				leafcuttermaps.reset();
			});
		}
	};
});

leafcutter.service("leafcuttermaps", function($q) {
	var maps = {};
	this.setMap  = function(id, map) {
		if (maps.hasOwnProperty(id)) {
			maps[id].resolve(map);
		} else {
			maps[id] = $q.defer().resolve(map);
		}
	};
	this.getMap = function(id) {
		if (!maps.hasOwnProperty(id)) {
			maps[id] = $q.defer();
		}
		return maps[id].promise;
	};
	this.reset = function() {
		maps = {};
	};
});