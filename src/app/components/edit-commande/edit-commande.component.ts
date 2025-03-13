import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-edit-commande',
  templateUrl: './edit-commande.component.html',
  styleUrls: ['./edit-commande.component.css']
})
export class EditCommandeComponent implements OnInit {
  commandeForm: FormGroup;
  commande: any = {};
  id!: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cService: CommandeService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.commandeForm = this.formBuilder.group({
      numero: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1)]],
      dateCommande: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'];

    this.cService.getCommandeById(this.id).subscribe(
      (res) => {
        this.commande = res;

        // Initialize the form with the existing data
        this.commandeForm.patchValue({
          numero: this.commande.numero,
          quantite: this.commande.quantite,
          dateCommande: this.commande.dateCommande,
          price: this.commande.price
        });

        // Calculate the total price when the page loads
        this.calculateTotalPrice();
      },
      (err) => {
        console.error('Erreur lors de la récupération de la commande', err);
      }
    );
  }

  // Function to calculate the total price based on price and quantity
  calculateTotalPrice() {
    const price = parseFloat(this.commande.price); // Ensure price is a number
    const quantity = parseInt(this.commande.quantite, 10); // Ensure quantity is a number

    if (!isNaN(price) && !isNaN(quantity)) {
      this.commande.totalPrice = price * quantity; // Multiply price by quantity
    } else {
      this.commande.totalPrice = 0; // Set to 0 if invalid price/quantity
    }
  }

  // Function to handle form submission
  editCommande(): void {
    if (this.commandeForm.invalid) {
      alert("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    // Handle the submission to update the commande
    this.cService.updateCommande(this.commande).subscribe(
      (response) => {
        alert("Commande mise à jour avec succès !");
        this.router.navigate(['/commandes']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la commande:', error);
        alert("Une erreur est survenue lors de la mise à jour de la commande.");
      }
    );
  }
}
