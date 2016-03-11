var leafcutter = angular.module("leafcutter", []);

leafcutter.directive("leaflet", function(leafcuttermaps) {
	return {
		restrict: "E",
		scope: {
			name: "=",
			options: "=?"
		},
		link: function(scope, element, attrs) {
			scope.layers = {};
			var options = {
				attributionControl: false,
				zoomControl: false,
				center: [30, 20],
				zoom: 2,
				baseLayer: L.tileLayer("http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {})
			};
			scope.map = L.map(element[0], options);
			if (options.baseLayer) {
				options.baseLayer.addTo(scope.map);
			}
			leafcuttermaps.setMap(attrs.map, {
				map: scope.map,
				addLayer: function(name, layer) {
					layer.addTo(scope.map);
					scope.layers[name] = layer;
				},
				removeLayer: function(name) {
					if (scope.layers.hasOwnProperty(name)) {
						scope.map.removeLayer(scope.layers[name]);
						delete scope.layers[name];	
					}
				},
				reset: function() {
					for (var layer in scope.layers) {
						if (scope.layers.hasOwnProperty(layer)) {
							scope.map.removeLayer(scope.layers[layer]);
						}
					}
					scope.layers = {};
				}
			});
			element.on("$destroy", function () {
				leafcuttermaps.remove(attrs.map);
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
	this.remove = function(id) {
		delete maps[id];
	};
});