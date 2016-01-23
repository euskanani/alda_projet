//CTRL AFFICHAGE DE TOUS LES ANNONCES
app.controller('customersCtrl',['$scope','$location','annonceFactory',function($scope,$location, annonceFactory) {
	
	//$scope.names = annonc;eFactory.query()
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
		console.log('Repos error :'+status)
	})

	$scope.consulter =function(id){
		$location.path('/infoannonce/' + id);
		// console.log(JSON.stringify(id));
	}
}])




//CTRL CONNEXION
app.controller("signinCtrl",['$scope','$http','$location','AppSession', function($scope,$http,$location,AppSession) {


	$scope.edit =false;
	$scope.submitLogin = function() {
		var params =JSON.stringify( { email: $scope.email,password :$scope.password})
		$http.post('http://localhost:8080/alda-projet/alda/users/login',params)
		.success(function(user) {
			if((user=="")||(user==null)){
				alert("email ou mot de passe éronné")
				$location.url('/connexion');
			}else {
				AppSession.setData(user);
				$location.url('/');
				//refresh after redirect to connect to own socket
				setTimeout('window.location.reload()', 0)
			}
		})
		.error(function(status) {
			console.log(status);
		});
	};
}]);


//CTRL HEADER SWICTH ENTRE UTILISATEUR CONNECTE ET NON-CONNECTE
app.controller('HeaderController', ['$scope','$rootScope','$location', 'AppSession','$http',function($scope,$rootScope, $location,AppSession,$http) {
	$scope.user = AppSession ;

	$scope.logout = function() {
		$http.post('http://localhost:8080/alda-projet/alda/users/logout/'+ AppSession.getData().email)
		.success(function(data) {
			alert("vous allez vous deconnecter !")
			AppSession.setData(null);
			$rootScope.closeChat();
			$location.url('/');
		})
		.error(function(status) {
			alert('erreur de deconnexion :'+status);
		});

	}
}]);


//CTRL MODIFICATION DE MES INFOS
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

		$http.put('http://localhost:8080/alda-projet/alda/users/updateUser',params)
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


//CTRL MODIFICATION ANNONCE
app.controller('monAnnonceCtrl', ['$scope','$http','$location','$stateParams',function($scope,$http ,$location, $stateParams) {


	$scope.id = $stateParams.id
	$scope.edit = false
	$http.get('http://localhost:8080/alda-projet/alda/announcements/getAnnouncementById/'+ $scope.id)
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

		$http.put('http://localhost:8080/alda-projet/alda/announcements/updateAnnouncement',params)
		.success(function(annonce) {

			$location.url('/mesannonces');
			alert('Bravo!Vous venez de modifier votre annonce')
		})
		.error(function(status) {
			console.log(status);
		});
	}

}]);


//CTRL AJOUT D'ANNONCE
app.controller('annonceCtrl', ['$scope','$rootScope','AppSession','$location', 'Upload', '$timeout', function ($scope,$rootScope,AppSession,$location, Upload, $timeout) {

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
			url: 'http://localhost:8080/alda-projet/alda/announcements/createAnnouncement/'+JSON.stringify($scope.announcement),
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




//CTRL INSCRIPTION
app.controller("signupCtrl",['$scope','$http','$location','$state','AppSession', function($scope,$http,$location,$state,AppSession) {

	$scope.signup=function(){

		if(($scope.signupPassword) != ($scope.passwordConfirm)){
			alert("mot de passe différent ")
		} else if($scope.signupPassword.length < 8){
			alert("le mot de passe doit avoir au moins 8 caracteres")
		} else{
			var params ={ email: $scope.signupEmail,password :$scope.signupPassword }
			alert($scope.signupEmail + "  "+ $scope.signupPassword)
			$http.post('http://localhost:8080/alda-projet/alda/users/addUser',params)
			.success(function(user) {
				if(user==""){
					alert("email déjà utilisé");
					$location.url('/connexion');
				}else {
					AppSession.setData(user);
					$location.url('/');	
					$window.location.url="/";
					$window.location.reload()
				}
			})
			.error(function(status) {
				console.log(status);
			});
		}
	}
}]);



// CTRL CONSULTER ET GERER SES PROPRES ANNONCES

app.controller("mesAnnoncesCtrl",['$scope','$http','$location','$uibModal','annonceFactory','AppSession', function($scope,$http,$location,$uibModal, annonceFactory,AppSession) {

	$http.get('http://localhost:8080/alda-projet/alda/announcements/'+AppSession.getData().email)
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
	
	$scope.marquerVendu=function(annonce){
		alert(annonce.statusVendu)

		if(annonce.statusVendu=='VENDU'){
			alert("votre annonce est déjà marqué comme vendu!")
		}else{
			$http.put('http://localhost:8080/alda-projet/alda/announcements/isSold',annonce)
			.success(function(data) {
				console.log(JSON.stringify(data));
				$location.url('/mesannonces');
				alert('Vous venez de marquer votre annonce comme vendu!')
			})
			.error(function(status) {
				console.log(status);
			});
		}	
	}

	//modal suppression d'une annonce
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
							url :'http://localhost:8080/alda-projet/alda/announcements/'+ id})
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




//CTRL CONSULTER ANNONCES TIERS ET CONTACT ANNONCEUR

app.controller('infoAnnonceCtrl', ['$scope','$rootScope','$http','$stateParams','$compile','$window',function($scope,$rootScope,$http , $stateParams,$compile,$window) {


	$scope.id = $stateParams.id
	$scope.edit = false
	$http.get('http://localhost:8080/alda-projet/alda/announcements/getAnnouncementById/'+ $scope.id)
	.success(function(data) {

		$scope.annonce = data

	})
	.error(function(status) {
		console.log(status);
	});

	$scope.openChat=function(){

		$http.get('http://localhost:8080/alda-projet/alda/users/connectedUsers')
		.success(function(data) {
			$scope.connectedUsers = data
			console.log(JSON.stringify(data))
			var isconnected;
			for(var key in $scope.connectedUsers){
				console.log(JSON.stringify($scope.connectedUsers[key]))
				if( $scope.connectedUsers[key]==$scope.annonce.mailAnnonceur){
					isconnected=true;
					$rootScope.chatVisibility=true;
					$rootScope.chatWith=$scope.annonce.mailAnnonceur;
					$rootScope.connectToChatserver($rootScope.chatWith);
					break;
				} else {
					isconnected=false;
				}
			}
			if(isconnected==false){
				alert("proprietaire non connecté!Vous pouvez lui envoyer un email")
			}
		})
		.error(function(status) {
			console.log(status);
		});

	}
}]);



//CTRL MOT DE PASSE OUBLIE :ENVOI EMAIL PAR JAVA MAIL
app.controller('passwordCtrl',['$scope','$http','$location',function($scope,$http,$location) {

	$scope.submitPassword =function(){

		$http.post('http://localhost:8080/alda-projet/alda/users/resetPassword/'+ $scope.user.email)
		.success(function(data) {

			if(data=="email envoye"){
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





//CTRL CHAT WEBSOCKET

app.controller('chatCtrl', function ($scope ,$rootScope,AppSession) {
	$rootScope.chatVisibility=false;

	$rootScope.closeChat=function(){
		$rootScope.wsocket.close();
		$rootScope.chatWindow=null;
		$rootScope.chatVisibility=false;
		$rootScope.chatWith='';
	}

	$rootScope.serviceLocation = "ws://localhost:8080/alda-projet/chat/"
		$scope.message={};
	$rootScope.chatWindow=[]
	$rootScope.room = '';

	$scope.onMessageReceived=function(evt) {
		//actualiser le rootscope
		setTimeout(function() {
			$rootScope.chatVisibility=true
			$scope.msg = JSON.parse(evt.data); // native API
			$rootScope.chatWindow.push($scope.msg)
			console.log("window object------------->   ::"+JSON.stringify($rootScope.chatWindow))	
			$rootScope.$apply(); //this triggers a $digest
		}, 0);

	}

	$rootScope.connectToChatserver = function(room) {
		console.log("connectToChatserver")
		$rootScope.wsocket = new WebSocket($rootScope.serviceLocation + room);
		$rootScope.wsocket.onmessage = $scope.onMessageReceived;
	}

	$rootScope.submitMessage=function() {
		var msg = '{"message":"' + $scope.message.contenu + '", "sender":"'
		+ AppSession.getData().email + '","receiver":"'+ $rootScope.chatWith +'","received":""}';
		console.log("I m gonna send message")
		$rootScope.wsocket.send(msg);
		//$message.val('').focus();
	}

	$scope.submit=function(evt) {
		evt.preventDefault();
	}

	//des la connexion, le client se connecte à son room
	if(AppSession.getData()!=null){
		$rootScope.connectToChatserver(AppSession.getData().email);
	}

});






//CTRL EVENEMENT SERVER SENT EVENT

app.controller("eventsCtrl",['$rootScope', function($rootScope){
	$scope.bool=false;

	//events add announcement
	if(typeof(EventSource) !== "undefined") {
		console.log('ici')
		var url = "alda/announcements/announcementEvent";
		var source = new EventSource(url);
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

