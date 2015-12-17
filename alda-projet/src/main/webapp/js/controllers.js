app.controller('customersCtrl',['$scope','annonceFactory',function($scope, annonceFactory) {

	//$scope.names = annonceFactory.query()
	annonceFactory.get().$promise.then(function(data) {
		$scope.names= data
	}, function(status){
		alert('Repos error :'+status)
	})
}])




//controller gardant lassesion
app.controller("signinCtrl",['$scope','$http','$location','AppSession', function($scope,$http,$location,AppSession) {

	$scope.submitLogin = function() {
		var params =JSON.stringify( { email: $scope.email,password :$scope.password})
		$http.post('http://localhost:8080/ExerciseJPAWithMysql/alda/users/login',params)
		.success(function(user) {
			if(user==""){
				alert("mot de passe éronné")
				$location.url('/connexion');
			}else {
				AppSession.setData(user);
				$location.url('/');
			}
		})
		.error(function(status) {
			console.log(status);
		});
	};
}]);


app.controller('HeaderController', ['$scope', 'AppSession',function($scope, AppSession) {
	$scope.user = AppSession ;

	$scope.logout = function() {
		AppSession.setData(null);
		$location.url('/');
	}
}]);

app.controller('mesinfosCtrl', ['$scope', 'AppSession',function($scope, AppSession) {
	$scope.user = AppSession ;
	$scope.edit =false;
	$scope.editables =$scope.user.getData();	

}]);

app.controller('annonceCtrl', ['$scope', 'AppSession',function($scope, AppSession) {
	$scope.user = AppSession ;
	
	alert(JSON.stringify($scope.nom + " " + $scope.description + " "
			+ $scope.prix + " " + $scope.image1 + " " + $scope.image2
			+ " " + AppSession.getData().email))

	$scope.save = function() {
		$http({
			method : 'POST',
			url : "/Api/PostStuff",
			headers : {
				'Content-Type' : false
			},
			data : {
				nom : $scope.nom,
				description : $scope.description,
				emplacement : $scope.emplacement,
				prix : $scope.prix,
				email : AppSession.getData().email,
				img_1 : $scope.image1,
				img_2 : $scope.file[1]
			}
		}).success(function(data, status, headers, config) {
			alert("success!");
		}).error(function(data, status, headers, config) {
			alert("failed!");
		});
	};

}]);



//controller pour l'inscription
app.controller("signupCtrl",['$scope','$http','$location','AppSession', function($scope,$http,$location,AppSession) {

	$scope.signup=function(){

		if(($scope.signupPassword) != ($scope.passwordConfirm)){
			alert("mot de passe différent ")
		} else if($scope.signupPassword.length < 8){
			alert("le mot de passe doit avoir au moins 8 caracteres")
		} else{
			var params ={ email: $scope.signupEmail,password :$scope.signupPassword }
			alert($scope.signupEmail + "  "+ $scope.signupPassword)
			$http.post('http://localhost:8080/ExerciseJPAWithMysql/alda/users/addUser',params)
			.success(function(user) {
					AppSession.setData(user);
					$location.url('/');
			})
			.error(function(status) {
				console.log(status);
			});
		}
	}
}]);


app.controller("mesAnnoncesCtrl",['$scope','$http','AppSession', function($scope,$http,AppSession) {
  alert(AppSession.getData().firstName)
  alert('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)
 
			
	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)
	.success(function(data) {
		alert(JSON.stringify(data))
		$scope.annonces = data
		
})
.error(function(status) {
	console.log(status);
});

  
	
}]);



