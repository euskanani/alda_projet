# alda_projet

Configuration du serveur Tomee pour envoyer pour l'enoie de l'email avec geronimo-javamail et ignorer java mail de JEE:
1. Dans le repertoire de tomee: -> Conf -> system.properties , ajouter la ligne:   openejb.classloader.forced-skip=javax.mail
2. Copier le fichier system.properties dans eclipse -> Project explorer -> Servers -> Tomcat v7.0 server at localhost-confg
