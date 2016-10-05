  
  var app = angular.module('myApp', ["ngRoute"]);
  app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "tea_store.html",
        controller: 'teasCtrl',
        type: 'expensive'
    })
    .when("/one_tea", {
        templateUrl : "one_tea.html"
    })
    .when("/filters", {
        templateUrl : "filters.html"
    })
    .when('/red', {
    	templateUrl: 'tea_store.html',
    	controller: 'teasCtrl',
    	type: 'red'
    })
    });
  app.controller('teasCtrl', function($scope, $http, $route) {
    if ($route.current && $route.current.$$route.type == 'red') {
    	$scope.showRed();
    }
    else if ($route.current && $route.current.$$route.type == 'expensive') {
    	$scope.showExpensive();
    }


  	window.scope = $scope;
    $scope.showAllTeas = true;


    $scope.edittea = function(tea) {
      $http.put("/teas/" + tea.pk, {"title": tea.fields.title, description: tea.fields.description});
      current_tea = $scope.teas.filter(function(cur_tea) { return cur_tea.pk == tea.pk })[0];
      current_tea.fields.title = tea.fields.title;
    }

    $scope.removetea = function(tea) {
      $scope.teas = $scope.teas.filter(function(cur_tea) { return cur_tea.pk != tea.pk });
      $http.delete('/teas/' + tea.pk);
      $scope.showAddtea = true;
      $scope.showTable()
    }

    $scope.showTable = function() {
      $scope.showteaTable = true;
      $scope.showSingletea = false;
      $scope.showEdittea = false;
      $scope.showAddtea = true;
    }

    $scope.addtea = function() {
      $scope.showAddtea = true;
      $http.post("/teas/ ", {"title":$scope.newTitle, description:$scope.newDesc})
      .then(function (response) {
       var tea = response.data;
       $scope.teas.push(tea);
     });
      $scope.showTable()
    }

    $scope.showBlack = function() {
    	$http.get("/show_teas?category=Black")
    	.then(function (response) {
        $scope.teas = response.data.teas;
      });
    }

    $scope.showRed = function() {
    	$http.get("/show_teas?category=Red")
    	.then(function (response) {
        $scope.teas = response.data.teas;
      });
    }

    $scope.showGreen = function() {
    	$http.get("/show_teas?category=Green")
    	.then(function (response) {
        $scope.teas = response.data.teas;
      });
    }

    $scope.setSelectedTea = function(tea) {
      $http.get("/one_tea?_id=" + tea._id)
      .then(function (response) {
        $scope.selectedTea = response.data.tea;
        $scope.showOneTea = true;
        $scope.showAllTeas = false;
      });
    };

    $scope.showExpensive = function() {
    $http.get("/expensive_teas")
    .then(function (response) {
      $scope.teas = response.data.teas;
    });
};

  });

