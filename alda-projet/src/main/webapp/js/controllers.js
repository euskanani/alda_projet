app.controller('customersCtrl',['$scope','$location','annonceFactory',function($scope,$location, annonceFactory) {

	//$scope.names = annonceFactory.query()
	annonceFactory.get().$promise.then(function(data) {
		$scope.names= data
		for(var key in data){
			if( data[key].statusVendu =='DISPONIBLE'){
				$scope.names[key].mystatusStyle={color:'green'}
			}else if (data[key].statusVendu =='VENDU'){
				$scope.names[key].mystatusStyle={color:'red'}
			}
		}
	}, function(status){
		alert('Repos error :'+status)
	})

	$scope.consulter =function(id){
		$location.path('/infoannonce/' + id);
		// console.log(JSON.stringify(id));
	}
}])




//controller gardant lassesion
app.controller("signinCtrl",['$scope','$http','$location','AppSession', function($scope,$http,$location,AppSession) {


	$scope.edit =false;
	$scope.submitLogin = function() {
		var params =JSON.stringify( { email: $scope.email,password :$scope.password})
		$http.post('http://localhost:8080/ExerciseJPAWithMysql/alda/users/login',params)
		.success(function(user) {
			if((user=="")||(user==null)){
				alert("email ou mot de passe éronné")
				alert ($scope.email)

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
				email    : $scope.editables.email,
				telephone    : $scope.editables.telephone,
				ville    : $scope.editables.ville,
				codePostale    : $scope.editables.codePostale
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


app.controller('monAnnonceCtrl', ['$scope','$http','$location','$stateParams',function($scope,$http ,$location, $stateParams) {


	$scope.id = $stateParams.id
	$scope.edit = false
	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/getAnnouncementById/'+ $scope.id)
	.success(function(data) {

		$scope.editables = data

	})
	.error(function(status) {
		console.log(status);
	});



	$scope.update =function(){
		var params = {
				//id : AppSession.getData().id,
				id : $scope.editables.id,
				name : $scope.editables.name,
				description : $scope.editables.description,
				emplacement    : $scope.editables.emplacement,
				prixMobilier   : $scope.editables.prixMobilier,
				surface   : $scope.editables.surface
		}

		$http.put('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/updateAnnouncement',params)
		.success(function(annonce) {

			$location.url('/mesannonces');
			alert('Bravo!Vous venez de modifier votre annonce')
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
				prixMobilier :$scope.model.prixMobilier,
				surface :$scope.model.surface
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
app.controller("signupCtrl",['$scope','$http','$location','$state','AppSession', function($scope,$http,$location,$state,AppSession) {

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


app.controller("mesAnnoncesCtrl",['$scope','$http','$location','$uibModal','annonceFactory','AppSession', function($scope,$http,$location,$uibModal, annonceFactory,AppSession) {

	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+AppSession.getData().email)
	.success(function(data) {
		console.log(JSON.stringify(data))
		$scope.annonces = data

	})
	.error(function(status) {
		console.log(status);
	});



	$scope.consulter =function(id){
		$location.path('/monannonce/' + id);
		// console.log(JSON.stringify(id));
	}


	//les modals
	$scope.openDeleteModal=function(ident){	
		var dialogOpts = {
				backdrop: true,
				keyboard: true,
				templateUrl: 'deleteModal.html', // Url du template HTML
				controller: ['$scope', '$uibModalInstance','scopeParent', 'id',
				             function($scope, $uibModalInstance,scopeParent,id) { //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
					$scope.deleteAnn = function() {
						$http({
							method : 'DELETE',
							url :'http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/'+ id})
							.success(function(status) {		
								window.location.reload(true); 
							})
							.error(function(status) {
								console.log("failed"+status);
							});

						//Fermeture de la fenêtre modale
						$uibModalInstance.close();
					};
					$scope.cancel = function() {
						// Appel à la fonction d'annulation.
						$uibModalInstance.dismiss('cancel');
					};
				}
				],

				resolve :      {  
					scopeParent: function() {
						return $scope; //On passe à la fenêtre modal une référence vers le scope parent.
					},
					id: function(){
						return ident; // On passe en paramètre l'id de l'élément à supprimer.
					}
				}
		}
		$uibModal.open(dialogOpts);
	}

}]);


app.controller('infoAnnonceCtrl', ['$scope','$http','$stateParams',function($scope,$http , $stateParams) {


	$scope.id = $stateParams.id
	$scope.edit = false
	$http.get('http://localhost:8080/ExerciseJPAWithMysql/alda/announcements/getAnnouncementById/'+ $scope.id)
	.success(function(data) {

		$scope.annonce = data

	})
	.error(function(status) {
		console.log(status);
	});





}]);

app.controller('passwordCtrl',['$scope','$http','$location',function($scope,$http,$location) {

	$scope.submitPassword =function(){

		$http.post('http://localhost:8080/ExerciseJPAWithMysql/alda/users/resetPassword/'+ $scope.user.email)
		.success(function(data) {

			if(data=="email envoyé"){
				alert("votre mot de pass a été envoyé à votre email")
			} else if (data=="email non valide"){
				alert('votre email est invalide')
			} else {
				alert("failed")
			}
			$location.url('/connexion');

		})
		.error(function(status) {
			console.log("reset password failed :"+status);
		});
	}

}])


app.controller("eventsCtrl",['$scope', function($scope){

	$scope.bool=false;

	//events add announcement
	if(typeof(EventSource) !== "undefined") {
		console.log('ici')
		var url = "alda/announcements/announcementEvent";
		var source = new EventSource(url,{withCredentials:false});
		console.log('creation source bien fait')

		source.onopen = function(event){
			// do something when the connection opens
			console.log("connexion opened")
		}



		source.onmessage = function (event) {
			console.log('onmessage entered')
			$scope.message = JSON.parse(event.data);
			$scope.bool=true;
			console.log(event.data);
			alert("EVENEMENT CLASS  :"+JSON.stringify(event.data))
		}
		source.addEventListener("user", function(event) {
			console.log('Listening entered')
			$scope.message = JSON.parse(event.data);
			$scope.bool=true;
			console.log("EVENEMENT DESCRIPTION  :"+event.name + " " + event.data);
			alert("EVENEMENT  :"+event.name + " " +event.data)
		}, false);

		source.onerror = function(event){
			//alert("event : something goes wrong")
			// do something when there's an error
		}

		source.addEventListener('error',function(event){
			console.log('error Liste entered')
			// do something
		},false);
	} else {
		$scope.message.email = "Sorry, your browser does not support server-sent events...";
		$scope.bool=true;
	}


	//source.close();


}])

