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


app.controller('HeaderController', ['$scope','$location', 'AppSession',function($scope, $location,AppSession) {
	$scope.user = AppSession ;

	$scope.logout = function() {
		AppSession.setData(null);
		$location.url('/');
	}
}]);

app.controller('mesinfosCtrl', ['$scope','$http','$location','AppSession',function($scope,$http ,$location, AppSession) {
	$scope.user = AppSession ;
	$scope.edit =false;
	$scope.editables =$scope.user.getData();	

	$scope.update =function(){
		var params = {
				id : AppSession.getData().id,
				firstName : $scope.editables.firstName,
				lastName : $scope.editables.lastName,
				email    : $scope.editables.email
		}

		$http.put('http://localhost:8080/ExerciseJPAWithMysql/alda/users/updateUser',params)
		.success(function(user) {
			console.log(JSON.stringify(user));
			AppSession.setData(user);
			$location.url('/');
			alert('Bravo!Vous venez de modifier vos informations')
		})
		.error(function(status) {
			console.log(status);
		});
	}

}]);


app.controller('annonceCtrl', ['$scope','AppSession','$location', 'Upload', '$timeout', function ($scope,AppSession,$location, Upload, $timeout) {

	$scope.model ={};
	$scope.model.mailAnnonceur=AppSession.getData().email;

	for (var key in $scope.model) { 
		console.log("adding "+key+" with calue:"+$scope.model[key]);
	}

	$scope.uploadPic = function(file) {
		$scope.announcement = {
				name: $scope.model.name,
				description :$scope.model.description,
				emplacement :$scope.model.emplacement,
				mailAnnonceur :$scope.model.mailAnnonceur,
				prixMobilier :$scope.prixMobilier
		};  

		for (var key in $scope.model) { 
			console.log("adding "+key+" with calue:"+$scope.model[key]);
		}
		console.log(JSON.stringify(file));

		file.upload = Upload.http({
			url: 'http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/createAnnouncement/'+JSON.stringify($scope.announcement),
			headers: {
				'Content-Type': file.type
			},
			method: 'POST',
			data : file
		});

		file.upload.then(function (response) {
			$timeout(function () {
				//file.result = response.data;
				console.log("success"+response.status+"  DATA  : "+response.data);
				$scope.show = $scope.show();
				$location.url('/mesannonces');
			});
		}, function (response) {
			if (response.status > 0)
				console.log(response.status);
		}, function (evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	}

	//small func for auto closing alert
	$scope.show=function(){
		$scope.isVisible = true;
	}


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
				if(user==""){
					alert("email déjà utilisé");
					$location.url('/connexion');
				}else {
					AppSession.setData(user);
					$location.url('/');	
				}
			})
			.error(function(status) {
				console.log(status);
			});
		}
	}
}]);


app.controller("mesAnnoncesCtrl",['$scope','$http','AppSession', function($scope,$http,AppSession) {
	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)
	.success(function(data) {
		console.log(JSON.stringify(data))
		$scope.annonces = data

	})
	.error(function(status) {
		console.log(status);
	});



}]);


