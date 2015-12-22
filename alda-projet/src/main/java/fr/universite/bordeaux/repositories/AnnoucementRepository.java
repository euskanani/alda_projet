package fr.universite.bordeaux.repositories;

import java.util.List;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import fr.universite.bordeaux.entities.Announcement;
import fr.universite.bordeaux.entities.User;

@Stateless
public class AnnoucementRepository {
    private static final String JPQL_SELECT_PAR_EMAIL = "SELECT a FROM Announcement a WHERE a.user=:user";
    private static final String JPQL_SELECT_ALL = "SELECT * FROM Announcement";
    private static final String PARAM_USER = "user";
    @PersistenceContext(unitName = "aldaPersistenceUnit")
    private EntityManager entityManager;

    public void addAnnouncement(Announcement announcement){
        entityManager.persist(announcement);
    }

    public List<Announcement> findAnnouncementsByUser(User user) {
        Query requete = entityManager.createQuery(JPQL_SELECT_PAR_EMAIL);
        requete.setParameter(PARAM_USER, user);
        @SuppressWarnings("unchecked")
        List<Announcement> announcements = (List<Announcement>)requete.getResultList();
        return announcements;
    }
    
    public Announcement findAnnouncementById(String id) {
		Query requete = entityManager.createNativeQuery("select * from Announcement where id='"+id+"'", Announcement.class);
		Announcement announcement = (Announcement) requete.getSingleResult();
		return announcement;
	}
    
    @SuppressWarnings("unchecked")
	public List<Announcement> getAllTheAnnouncements(){
    	 Query requete = entityManager.createQuery("select a from Announcement a");
        
         List<Announcement> announcements = (List<Announcement>)requete.getResultList();
         return announcements;
	}
    
public void updateAnnouncement(Announcement announcement){
		
		entityManager.merge(announcement);
	}

public void deleteAnnouncement(int id){
	Query requete = entityManager.createNativeQuery("select * from Announcement where id='"+id+"'", Announcement.class);
	//User user = (User) requete.getSingleResult();
	Announcement announcement = (Announcement) requete.getSingleResult();
	entityManager.remove(announcement);
}
}
