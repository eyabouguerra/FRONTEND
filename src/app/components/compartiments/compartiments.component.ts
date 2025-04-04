import { Component, OnInit } from '@angular/core';
import { CompartimentService } from 'src/app/services/compartiment.service';

@Component({
  selector: 'app-compartiments',
  templateUrl: './compartiments.component.html',
  styleUrls: ['./compartiments.component.css']
})
export class CompartimentsComponent implements OnInit {

  compartiments: any[] = [];
  citernes: any[] = [];  // Define the citernes array
  nouvelleCompartment: any = {
    reference: '',
    capaciteMax: null,
    statut: 'VIDE', 
    citerneId: null
  };
  compartimentEnCours: any = null;

  constructor(private compartimentService: CompartimentService) { }

  ngOnInit(): void {
    this.getCompartiments();
    this.getCiternes();  // Fetch citernes when the component is initialized
  }

  // Fetch compartiments from the backend
  getCompartiments(): void {
    this.compartimentService.getCompartiments().subscribe(data => {
      this.compartiments = data;
    }, error => {
      console.error('Error fetching compartiments:', error);
      alert('Erreur lors de la récupération des compartiments.');
    });
  }

  // Fetch citernes from the backend
  getCiternes(): void {
    this.compartimentService.getCiternes().subscribe(
      data => {
        this.citernes = data;
      },
      error => {
        console.error('Error fetching citernes:', error);
        alert('Erreur lors de la récupération des citernes. Détails : ' + error.message);
      }
    );
  }

  // Add a new compartiment
  ajouterCompartiment(): void {
    if (!this.nouvelleCompartment.reference || !this.nouvelleCompartment.capaciteMax || !this.nouvelleCompartment.citerneId) {
      alert('Veuillez remplir tous les champs, y compris l\'ID de la citerne.');
      return;
    }
  
    if (this.nouvelleCompartment.capaciteMax <= 0) {
      alert('La capacité maximale doit être un nombre positif.');
      return;
    }
  
    // Si nécessaire, envoyez simplement l'ID de la citerne
    this.nouvelleCompartment.citerne = { id: this.nouvelleCompartment.citerneId };
  
    this.compartimentService.addCompartiment(this.nouvelleCompartment).subscribe(
      () => {
        this.getCompartiments();
        this.resetForm();
      },
      (error) => {
        console.error('Error adding compartiment:', error);
        alert('Une erreur est survenue lors de l\'ajout du compartiment.');
      }
    );
  }
  
// Méthode pour afficher le modal avec le compartiment en cours
editCompartiment(id: number): void {
  this.compartimentService.getCompartiment(id).subscribe(
    data => {
      this.compartimentEnCours = data;
      const modal = document.querySelector('.modal') as HTMLElement;
      if (modal) {
        modal.style.display = 'block'; // Afficher le modal après récupération du compartiment
      }
    },
    error => {
      console.error('Erreur lors du chargement du compartiment:', error);
      alert('Une erreur est survenue lors du chargement du compartiment. Détails de l\'erreur : ' + error.message);
    }
  );
}


// Méthode pour sauvegarder les modifications du compartiment
sauvegarderModification(): void {
  if (!this.compartimentEnCours.reference || !this.compartimentEnCours.capaciteMax) {
    alert('Veuillez remplir tous les champs valides.');
    return;
  }

  if (this.compartimentEnCours.capaciteMax <= 0) {
    alert('La capacité maximale doit être un nombre positif.');
    return;
  }

  this.compartimentService.updateCompartiment(this.compartimentEnCours).subscribe(
    () => {
      this.getCompartiments();
      this.closeModal(); // Fermer le modal après sauvegarde
    },
    error => {
      console.error('Erreur lors de la modification du compartiment:', error);
      alert('Une erreur est survenue lors de la modification du compartiment.');
    }
  );
}



  // Delete a compartiment
  supprimerCompartiment(id: number): void {
    // Vérifier que l'ID est valide
    if (id <= 0 || isNaN(id)) {
        alert('ID invalide. La suppression a échoué.');
        return;
    }

    // Confirmer l'action de suppression avec l'utilisateur
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer ce compartiment ? Cette action est irréversible.');

    if (confirmation) {
        // Si l'utilisateur confirme, procéder à la suppression
        this.compartimentService.deleteCompartiment(id).subscribe(
            () => {
                this.getCompartiments();  // Actualiser la liste après suppression
                alert('Le compartiment a été supprimé avec succès.');
            },
            (error) => {
                console.error('Erreur lors de la suppression du compartiment:', error);
                alert('Une erreur est survenue lors de la suppression du compartiment.');
            }
        );
    } else {
        // Si l'utilisateur annule, rien ne se passe
        console.log('Suppression annulée.');
    }
}


  // Reset form fields
  resetForm(): void {
    this.nouvelleCompartment = {
      reference: '',
      capaciteMax: null,
      statut: 'VIDE',
      citerneId: null  // Reset citerneId
    };
  }

  // Close the modal
  closeModal(): void {
    this.compartimentEnCours = null;
    document.querySelector('.modal')?.classList.remove('show');
  }

  // Validate the form before adding a compartiment
  isFormValid(): boolean {
    return this.nouvelleCompartment.reference && this.nouvelleCompartment.capaciteMax > 0;
  }

  // Validate the form before editing a compartiment
  isFormValidEdit(): boolean {
    return this.compartimentEnCours && this.compartimentEnCours.reference && this.compartimentEnCours.capaciteMax > 0;
  }
}
