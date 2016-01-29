# alda_projet : QUELQUES PRECISIONS DE DEPLOIEMENT :


CONFIGURATION DU SERVEUR TOMEE POUR EVITER LES CONFLITS:
utiliser geronimo-javamail et ignorer java mail de JEE:
1. Dans le repertoire de tomee: -> Conf -> system.properties , 
  ajouter la ligne:
openejb.classloader.forced-skip=javax.mail

2. Copier le fichier system.properties dans 
   eclipse -> Project explorer -> Servers -> Tomcat v7.0 server at localhost-confg


#CONFIGURATION DU CHAT :
  1.Pour lancer le chat avec le proprietaire, il faut se connecter
  2.Pour chatter avec le proprietaire, il faut qu'il soit lui aussi connecté
  

  
