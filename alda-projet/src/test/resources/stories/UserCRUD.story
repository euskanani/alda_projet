Scenario: Add User successfully
 
Given a user with email bddtest5@universitebordeaux.com and password is toto1234
When I add user
Then a user with email bddtest5@universitebordeaux.com should be added into the database


Scenario: show my own announcement 
 
Given  user with email youssef-522@hotmail.com and password is damimad@8
When I'm login
Then a user with email youssef-522@hotmail.com will see their own announcement


Scenario: Add an announcement 
 
Given  user with email youssef-522@hotmail.com and password is damimad@8
When I'm login
Then a user with email youssef-522@hotmail.com will add an announcement




