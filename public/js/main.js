  
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
	.when('/red', {
		templateUrl: 'tea_store.html',
		controller: 'teasCtrl',
		type: 'red'
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

app.service('Cart', function($cookies, $cookieStore){
  var cartFromCookies = $cookieStore.get('cart');
  var cart = cartFromCookies || {}
  cart.items = cart.items || []; 
  cart.addItem = function(item) { 
  	cart.items.push(item);
  	$cookieStore.put('cart', cart);
  	console.log($cookieStore.get('cart').items[0])
  }

  cart.removeItem = function(item) { 
  	cart.items.pop(item); 
  }

  cart.isInCart = function(obj) { 
  	 return (cart.items.indexOf(obj) != -1);
  }

  return cart;
});

app.controller('headerCtrl', function($scope, $cookies, $cookieStore, Cart) {
   $scope.cart = Cart;
   $scope.text = ' enter your text'
});

app.controller('oneTeaCtrl', function($scope, $http, $route, $cookies, $cookieStore, Cart) {
	window.oneTeaCtrl = $scope;
	$scope.cart = Cart;
	
	$scope.id= $route.current.params._id;
	$http.get("/one_tea?_id=" + $scope.id)
	.then(function (response) {
		$scope.selectedTea = response.data.tea;
	});
});

app.controller('teasCtrl', function($scope, $http, $route, $cookies, $cookieStore, Cart) {
	// use service, from controller update service
	window.teasCtrl = $scope;

	$scope.cart = Cart;
	$scope.cartCookie = $cookieStore.get('item');
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


