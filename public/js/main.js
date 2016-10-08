  
var app = angular.module('myApp', ["ngRoute"]);
app.config(function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl : "tea_store.html",
		controller: 'teasCtrl',
		type: 'expensive'
	})
	.when("/one_tea", {
		templateUrl : "one_tea.html",
		controller: 'oneTeaCtrl'
	})
	.when("/filters", {
		templateUrl : "filters.html"
	})
	.when('/red', {
		templateUrl: 'tea_store.html',
		controller: 'teasCtrl',
		type: 'red'
	})

	.when('/:filterType/:filterVal', {
		templateUrl: 'tea_store.html',
		controller: 'teasCtrl'
	})

});

app.controller('oneTeaCtrl', function($scope, $http, $route) {
	$scope.id= $route.current.params._id;
	$http.get("/one_tea?_id=" + $scope.id)
	.then(function (response) {
		$scope.selectedTea = response.data.tea;
	});
});

app.controller('teasCtrl', function($scope, $http, $route) {
	


	$scope.showFiltered = function() {
		$http.get("/show_teas?" + $scope.filterType + "=" + $scope.filterVal)
		.then(function (response) {
			$scope.teas = response.data.teas;
		});
	}

	if ($route.current && $route.current.params.filterType) {
		$scope.filterType = $route.current.params.filterType;
		$scope.filterVal = $route.current.params.filterVal;
		$scope.showFiltered();
	} else {
		$http.get("/expensive_teas")
		.then(function (response) {
			$scope.teas = response.data.teas;
		});
	};

	window.scope = $scope;

});


