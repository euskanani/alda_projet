app.factory('userFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/addUser/:email',{email : '@email'},
			{
		      'get':    {method:'GET',isArray:true }  //config get in order to use it to get array json
			});
}])


app.factory('userFact', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/:email',{email : '@email'},
			{
		      'get':    {method:'GET',isArray:true }  //config get in order to use it to get array json
			});
}])


app.factory('annonceFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/:id',{id : '@id'},
			{
		'get':    {method:'GET',isArray:true}  //config get in order to use it to get array json
			});
}])


//permettre d'acceder au user n'importe où
app.service('Auth', function() {
	var user = window.user;

	return {
		getUser: function() {
			return user;
		},
		setUser: function(newUser) {
			user = newUser;
		},
		isConnected: function() {
			return !!user;
		}
	};
});