# QUELQUES PRECISIONS DE DEPLOIEMENT :


## CONFIGURATION DU SERVEUR TOMEE POUR EVITER LES CONFLITS: utiliser geronimo-javamail et ignorer java mail de JEE :
~~~bash
1. Dans le repertoire de tomee: -> Conf -> system.properties , 
   ajouter la ligne:
     openejb.classloader.forced-skip=javax.mail

2. Copier le fichier system.properties dans 
   eclipse -> Project explorer -> Servers -> Tomcat v7.0 server at localhost-confg
~~~

Parfois,pour des raisons de certification sur windows, Java mail recommande de deployer le projet avec JRE plutôt que JDK.


i
## CONFIGURATION DU CHAT :
 
       1.Pour lancer le chat avec le proprietaire, il faut se connecter
  
       2.Pour chatter avec le proprietaire, il faut qu'il soit lui aussi connecté
  

## SESSION SERVEUR ET SESSION CLIENT :
 
       Le serveur garde dans sa session, la liste des utilisateurs connectés.Du coup au redemarrage du serveur,
       Il faut aussi redemarrer le navigateur puis se reconnecter  pour reinitialiser la session côté serveur.
  
## INSTALLATIONS DES DEPENDANCES  :
 
   Après import du projet, lancer 
   ~~~bash
      \git\alda_projet\alda-projet\src\main\webapp> bower install 
   ~~~
   pour installer les modules angular.
 
 

