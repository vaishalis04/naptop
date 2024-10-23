import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Import ActivatedRoute
import { ApiService } from '../../services/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-taulparchi-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    NgxPaginationModule,
  ],
  templateUrl: './taulparchi-view.component.html',
  styleUrl: './taulparchi-view.component.css',
})
export class TaulparchiViewComponent implements OnInit {
  taulaParchi: any = {}; // Store the specific taulaParchi details here

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute, // Inject ActivatedRoute to capture route parameters
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the ID from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getTaulaParchiById(id);
    }
  }

  // Fetch Taula Parchi by ID
  getTaulaParchiById(id: string) {
    this.apiService.get(`taulparchi/${id}`).subscribe({
      next: (res: any) => {
        console.log("res",res)
        this.taulaParchi = res;
        console.log("taulparchi",res)
      },
      error: (err: any) => {
        console.error('Error fetching Taula Parchi details:', err);
      },
    });
  }

  // Navigate back to the previous page
  goBack() {
    this.router.navigate(['/taul-parchi-dashboard']); // Adjust the route as needed
  }
}
