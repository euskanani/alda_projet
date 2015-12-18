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
	
	$scope.editables = {}
	$scope.editables.firstName = AppSession.getData().firstName;
	$scope.editables.lastName = AppSession.getData().lastName;
	$scope.editables.email = AppSession.getData().email;
	//$scope.editables =$scope.user.getData();
	
	$scope.update=function(){

            //alert(JSON.stringify($scope.editables.firstName))		
			var params ={ firstName: $scope.editables.firstName,lastName :$scope.editables.lastName, email :$scope.editables.email }
			
			$http.post('http://localhost:8080/ExerciseJPAWithMysql/alda/users/updateUser',params)
			.success(function(user) {
				AppSession.setData(user);
				$location.url('/');
				alert("modification reussie")
			})
			.error(function(status) {
				console.log(status);
				alert(status)
			});
		
	}
	

}]);




/*
app.directive('fileUpload', function () {
	return {
		scope: true,        //create a new scope
		link: function (scope, el, attrs) {
			el.bind('change', function (event) {
				var files = event.target.files;
				//iterate files since 'multiple' may be specified on the element
				for (var i = 0;i<files.length;i++) {
					//emit event upward
					scope.$emit("fileSelected", { file: files[i] });
				}                                       
			});
		}
	};
});*/


/*

app.controller('annonceCtrl', ['$scope', 'AppSession',function($scope, AppSession) {
	$scope.user = AppSession ;

	$scope.model = {
			nom : $scope.nom,
			description : $scope.description,
			emplacement : $scope.emplacement,
			prix : $scope.prix,
			email : AppSession.getData().email
	}

	//an array of files selected
	$scope.files = [];

	//listen for the file selected event
	$scope.$on("fileSelected", function(event, args) {
		$scope.$apply(function() {
			//add the file object to the scope's files collection
			$scope.files.push(args.file);
		});
	});


	$http({
		method: 'POST',
		url: "/Api/PostStuff",
		headers: { 'Content-Type': false },
		transformRequest: function (data) {
			var formData = new FormData();
			formData.append("model", angular.toJson(data.model));
			for (var i = 0; i < data.files; i++) {
				//add each file to the form data and iteratively name them
				formData.append("file" + i, data.files[i]);
			}
			return formData;
		},
		data: { model: $scope.model, files: $scope.files }
	}).
	success(function (data, status, headers, config) {
		alert("success!");
	}).
	error(function (data, status, headers, config) {
		alert("failed!");
	});
}]); */



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
 /* alert(AppSession.getData().firstName)
  alert('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)*/
 
			
	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)
	.success(function(data) {
		//alert(JSON.stringify(data))
		$scope.annonces = data
		
})
.error(function(status) {
	console.log(status);
});
	


  
	
}]);



