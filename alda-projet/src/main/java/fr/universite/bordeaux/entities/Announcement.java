package fr.universite.bordeaux.entities;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;


/**
 * The persistent class for the announcement database table.
 * 
 */
@Entity
@NamedQuery(name="Announcement.findAll", query="SELECT a FROM Announcement a")
public class Announcement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private String id;

	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;

	private String description;

	private String emplacement;

	@Lob
	@Column(name="img_1")
	private byte[] img1;

	@Lob
	@Column(name="img_2")
	private byte[] img2;

	@Column(name="mail_annonceur")
	private String mailAnnonceur;

	private String name;

	@Column(name="prix_mobilier")
	private int prixMobilier;

	@Column(name="status_vendu")
	private String statusVendu;

	//bi-directional many-to-one association to User
	@JsonIgnore
	@ManyToOne
	private User user;

	public Announcement() {
	}

	public String getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreatedDate() {
		return this.createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getDescription() {
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getEmplacement() {
		return this.emplacement;
	}

	public void setEmplacement(String emplacement) {
		this.emplacement = emplacement;
	}

	public byte[] getImg1() {
		return this.img1;
	}

	public void setImg1(byte[] img1) {
		this.img1 = img1;
	}

	public byte[] getImg2() {
		return this.img2;
	}

	public void setImg2(byte[] img2) {
		this.img2 = img2;
	}

	public String getMailAnnonceur() {
		return this.mailAnnonceur;
	}

	public void setMailAnnonceur(String mailAnnonceur) {
		this.mailAnnonceur = mailAnnonceur;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getPrixMobilier() {
		return this.prixMobilier;
	}

	public void setPrixMobilier(int prixMobilier) {
		this.prixMobilier = prixMobilier;
	}

	public String getStatusVendu() {
		return this.statusVendu;
	}

	public void setStatusVendu(String statusVendu) {
		this.statusVendu = statusVendu;
	}

	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}