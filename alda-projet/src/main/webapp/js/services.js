//factory qui permet de recupere un utilisateur par mail
app.factory('userFact', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/:email',{email : '@email'},
			{
		'get':    {method:'GET',isArray:true }
			});
}])


//factory recuperation des annonces
app.factory('annonceFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/:email',{email : '@email'},
			{
		'get':    {method:'GET',isArray:true}, //configuer get pour pouvoir recevoir jSON
	 'delete':    {method: 'DELETE', params: {id: '@id'} }
			});
}])


//factory pour modifier un user
app.factory('updateUserFactory', function ($resource) {
    return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/updateUser/:email', {email : '@email'}, {
        
        update: { method: 'PUT', params: {email: '@email'} },
        
    })
});


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
		/*update : function() {
			return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/updateUser/:email',{email : '@email'},
					{
				update :    {method:'PUT' , params: {id: '@id'}}  
					});
		},*/
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
app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(data, uploadUrl){
        var fd = new FormData();
        for(var key in data){
        	fd.append(key, data[key]);
        	console.log(data[key])
        }
        $http({
            method  : 'POST',
        	url : uploadUrl,
        	data : fd, 
        	headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        })
        .success(function(){
        	console.log("success"+status)
        })
        .error(function(){
        	console.log("failed"+status)
        });
    }
}]);*/


/*
app.factory('userFactory', ['$resource', function($resource){
	return $resource('http://localhost:8080/ExerciseJPAWithMysql/alda/users/addUser/:email',{email : '@email'},
			{
		'get':    {method:'GET',isArray:true }  //config get in order to use it to get array json
			});
}])

*/

