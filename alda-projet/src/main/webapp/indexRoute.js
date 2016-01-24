
var app = angular.module('myApp',['ngResource','ui.router','ngFileUpload','ui.bootstrap','sticky'])


//using ui-router
app.config(function($stateProvider, $urlRouterProvider){   
	// For any unmatched url, send to /route1
	$urlRouterProvider.otherwise("/")

	$stateProvider
	.state('home', {
		url: "/",
		templateUrl: "partials/home.html",
		controller: 'customersCtrl',
	})

	.state('inscription', {
		url: "/inscription",
		templateUrl: "partials/signup.html",
		controller: 'signupCtrl',
	})

	.state('product', {
		url: "/product",
		templateUrl: "partials/product.html",
		controller: 'productCtrl',
	})

	.state('service', {
		url: "/service",
		templateUrl: "partials/service.html",
		controller: 'productCtrl',
	})

	.state('annonce', {
		url: "/annonce",
		templateUrl: "partials/ajoutannonce.html",
		controller: 'annonceCtrl',
	})



	.state('connexion', {
		url: "/connexion",
		templateUrl: "partials/signin.html",
		controller: 'signinCtrl',
	})

	.state('dashboard', {
		url: "/dashboard",
		templateUrl: "partials/dashboard.html",
		controller: 'dashboardCtrl',
	})

	.state('mesinfos', {
		url: "/mesinfos",
		templateUrl: "partials/mesinfos.html",
		controller: 'mesinfosCtrl',
	})
	.state('mesannonces', {
		url: "/mesannonces",
		templateUrl: "partials/our_works.html",
		controller: 'mesAnnoncesCtrl',
	})
	.state('monannonce', {
		url: "/monannonce/:id",
		templateUrl: "partials/monannonce.html",
		controller: 'monAnnonceCtrl'
	})
	.state('infoannonce', {
		url: "/infoannonce/:id",
		templateUrl: "partials/infoannonce.html",
		controller: 'infoAnnonceCtrl'
	})
	.state('lostpassword', {
		url: "/lostpassword",
		templateUrl: "partials/lostpassword.html",
		controller: 'passwordCtrl'
	})

	.state('alert', {
		url: "/alert",
		templateUrl: "partials/alert.html",
		controller: 'eventsCtrl'
	})

})


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
