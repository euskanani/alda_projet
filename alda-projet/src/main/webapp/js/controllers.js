app.controller('customersCtrl',['$scope','annonceFactory',function($scope, annonceFactory) {

	//$scope.names = annonceFactory.query()
	annonceFactory.get().$promise.then(function(data) {
		$scope.names= data
	}, function(status){
		alert('Repos error :'+status)
	})
}])

app.controller('signinCtrl',['$scope','$state','userFactory',function($scope,$state,userFactory) {

	$scope.signin=function(){

		$scope.user = {
				email:$scope.email	,
				password : $scope.password
		}

		alert(JSON.stringify($scope.email + " "+$scope.password))
		//userFactory.save($scope.user)
		if($scope.email=='admin' && $scope.password=="admin"){
			$state.go('^.dashboard');
			//$location.path('dashborad');
		} else {
			alert('wrong credentials')
		}
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


app.controller('AuthController', ['$scope', '$location', '$http', 'Auth',function($scope, $location, $http, Auth) {
	$scope.userData = {};
	$scope.loginError = '';

	$scope.submitLogin = function() {
		alert('http://localhost:8080/ExerciseJPAWithMysql/alda/users/'+$scope.email)
		$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/users/'+$scope.email)
		.success(function(user) {
			alert(JSON.stringify(user))
			Auth.setUser(user);
			$location.url('/');
		})
		.error(function(data) {
			$scope.loginError = data.loginError;
		});
	};
}]);


app.controller('HeaderController', ['$scope', 'Auth',function($scope, Auth) {
	$scope.user = Auth;
}]);
