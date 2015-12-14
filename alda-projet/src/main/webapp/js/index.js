
var app = angular.module('myApp',['ngResource'])


app.controller('customersCtrl',['$scope','annonceFactory',function($scope, annonceFactory) {

	//$scope.names = annonceFactory.query()
	annonceFactory.get().$promise.then(function(data) {
		$scope.names= data
	}, function(status){
		alert('Repos error :'+status)
	})
}])

app.controller('signinCtrl',['$scope','userFactory',function($scope, userFactory) {

	$scope.signin=function(){

		$scope.user = {
				email:$scope.email	,
				password : $scope.password
		}

		alert(JSON.stringify($scope.email + " "+$scope.password))
		userFactory.save($scope.user)
	}
}])



app.controller('signupCtrl',['$scope','userFactory',function($scope, userFactory) {

	$scope.signup=function(){

		if(($scope.signupPassword) != ($scope.passwordConfirm)){
			alert("mot de passe différent "+$scope.signupPassword+"  "+$scope.passwordConfirm)
		} else if($scope.signupPassword.length < 8){
			alert("le mot de passe doit avoir au moins 8 caracteres")
		} else{
			$scope.signupUser = {
					email:$scope.signupEmail	,
					password : $scope.signupPassword
			}

			alert(JSON.stringify($scope.signupEmail + " "+$scope.signupPassword))
			userFactory.save($scope.signupUser)
		}

	}
}])





/*http://localhost:8080/ExerciseJPAWithMysql-1.0-SNAPSHOT/alda/users/addUser
       {
        "email": "emailREST@gmail.com",
         "password": "passwordREST"
       }

 */













/*
var user = angular.module('app.user'). controller('UserCtrl', ['$scope', 'User', function($scope, User) {
$scope.users = {};


User.get().$promise.then(function(data) {
      $scope.users = data;
  }, function(error){/*Error treatment*/
/*
      };);
}]);


var deleteUser = function(user) {
   User.delete(user.slug);
};


var createUser = function(user) {
   User.save(user);
};


var editUser = function(user) {
   User.update(user);
};

}];
 */







