  
var app = angular.module('myApp', ["ngRoute","ngCookies"]);

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
	.when('/search/:value', {
		templateUrl: 'tea_store.html',
		controller: 'teasCtrl'
	})
	.when('/:filterType/:filterVal', {
		templateUrl: 'tea_store.html',
		controller: 'teasCtrl'
	})

});

app.service('Cart', function($cookieStore){
  var cartFromCookies = $cookieStore.get('cart');
  var cart = cartFromCookies || {}
  cart.items = cart.items || []; 
  cart.addItem = function(item) { 
  	cart.items.push(item);
  	$cookieStore.put('cart', cart);
  }

  cart.removeItem = function(item) { 
  	cart.items.pop(item); 
  	$cookieStore.remove('cart');
  	$cookieStore.put('cart', cart);
  }

  cart.isInCart = function(obj) { 
  	 return (cart.items.indexOf(obj) != -1);
  }

  return cart;
});

app.controller('headerCtrl', function($scope, $cookieStore, Cart) {
   $scope.cart = Cart;
   $scope.text = ' search by tea name'
});

app.controller('oneTeaCtrl', function($scope, $http, $route, $cookieStore, Cart) {
	window.oneTeaCtrl = $scope;
	$scope.cart = Cart;
	
	$scope.id= $route.current.params._id;
	$http.get("/one_tea?_id=" + $scope.id)
	.then(function (response) {
		$scope.selectedTea = response.data.tea;
	});
});

app.controller('teasCtrl', function($scope, $http, $route, $cookieStore, Cart) {
	window.teasCtrl = $scope;

	$scope.cart = Cart;
	$scope.showFiltered = function() {
		$http.get("/show_teas?" + $scope.filterType + "=" + $scope.filterVal)
		.then(function (response) {
			$scope.teas = response.data.teas;
		});
	}

	$scope.showText= function() {
		$http.get("/show_teas?name="  + $scope.value)
		.then(function (response) {
			$scope.teas = response.data.teas;
		});
	}

	if ($route.current && $route.current.params.filterType) {
		$scope.filterType = $route.current.params.filterType;
		$scope.filterVal = $route.current.params.filterVal;
		$scope.showFiltered();
	} else if ($route.current && $route.current.params.value) {
		$scope.value = $route.current.params.value;
		$scope.showText();
	} else {
		$http.get("/expensive_teas")
		.then(function (response) {
			$scope.teas = response.data.teas;
		});
	};

	window.scope = $scope;

});


