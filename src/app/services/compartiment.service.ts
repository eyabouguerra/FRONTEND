import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompartimentService {

  private apiUrl = 'http://localhost:8080/api/compartiments'; // Replace with your API base URL

  constructor(private http: HttpClient) { }

  // Get the list of citernes
  getCiternes(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/citernes`); // Replace with your actual endpoint
  }

  // Get compartiments
  getCompartiments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Add a new compartiment
  addCompartiment(compartiment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, compartiment);
  }

  // Get a single compartiment by ID
  getCompartiment(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`); // Vérifiez que l'URL est correcte
  }
  

  // Update a compartiment
  updateCompartiment(compartiment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${compartiment.id}`, compartiment);
  }
  

  deleteCompartiment(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
}

}
