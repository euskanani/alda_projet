//factory qui permet de recupere un utilisateur par mail
app.factory('userFact', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/:email',{email : '@email'},
			{
		'get':    {method:'GET',isArray:true }
			});
}])


//factory recuperation des annonces
app.factory('annonceFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/:id',{id : '@id'},
			{
		'get':    {method:'GET',isArray:true}  //configuer get pour pouvoir recevoir jSON
			});
}])


//factory qui gere la gestion de la session
app.factory("AppSession", function($window, $rootScope) {

	angular.element($window).on('storage', function(event) {
		if (event.key === 'my-storage') {
			$rootScope.$apply();
		}
	});

	return {
		setData: function(val) {
			$window.localStorage && $window.localStorage.setItem('my-storage', JSON.stringify(val));
			return this;
		},
		getData: function() {
			return JSON.parse($window.localStorage && $window.localStorage.getItem('my-storage'));
		},

		isConnected: function(val){
			if(val!= null){
				return true 

			}else{
				return false
			}
		}
	};
});



/*
app.factory('userFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/addUser/:email',{email : '@email'},
			{
		'get':    {method:'GET',isArray:true }  //config get in order to use it to get array json
			});
}])

*/

/*
//permettre d'acceder au user n'importe où
app.service('Auth', function() {
	return {
		getUser: function() {
			return window.user;
		},
		setUser: function(newUser) {
			window.user = newUser;
		},
		isConnected: function() {
			return !!window.user;
		}
	};
});

*/