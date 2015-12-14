
var app = angular.module('myApp',['ngResource','ui.router'])


/*//using ngRouter
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/', {templateUrl: 'partials/home.html', controller: 'customersCtrl'})
	.when('/inscription', {templateUrl: 'partials/signup.html', controller: 'signupCtrl'})
	.when('/connexion', {templateUrl: 'partials/signin.html', controller: 'signinCtrl'})
	.when('/dashboard', {templateUrl: 'partials/dashboard.html', authenticated :true, controller: 'dashboardCtrl'})
	.otherwise({redirectTo: '/'});
//	$locationProvider.html5Mode(true);

}]); */


//using ui-router
app.config(function($stateProvider, $urlRouterProvider){   
	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

	$stateProvider
	.state('home', {
		url: "/",
		templateUrl: "partials/home.html",
		controller: 'customersCtrl',
		//authenticate: false
	})

	.state('inscription', {
		url: "/inscription",
		templateUrl: "partials/signup.html",
		controller: 'signupCtrl',
		//authenticate: false
	})

	.state('product', {
		url: "/product",
		templateUrl: "partials/product.html",
		controller: 'productCtrl',
		//authenticate: false
	})

	.state('service', {
		url: "/service",
		templateUrl: "partials/service.html",
		controller: 'productCtrl',
		//authenticate: false
	})



	.state('connexion', {
		url: "/connexion",
		templateUrl: "partials/signin.html",
		controller: 'signinCtrl',
		//authenticate: false
	})

	.state('dashboard', {
		url: "/dashboard",
		templateUrl: "partials/dashboard.html",
		controller: 'dashboardCtrl',
		//authenticate: true
		//resolve: { connected: checkIsConnected}
	})
})







/*http://localhost:8080/ExerciseJPAWithMysql-1.0-SNAPSHOT/alda/users/addUser
       {
        "email": "emailREST@gmail.com",
         "password": "passwordREST"
       }

 */