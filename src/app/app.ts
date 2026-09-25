import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AprendizService } from './services/aprendiz.service';
import { TytDataService } from './services/tyt-data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  readonly aprendizService = inject(AprendizService);
  readonly tyt = inject(TytDataService);

  readonly registrado = this.aprendizService.estaRegistrado;
  readonly aprendiz = this.aprendizService.aprendiz;
  readonly iniciales = computed(() => this.aprendizService.iniciales());

  cerrarSesion(): void {
    this.aprendizService.cerrarSesion();
    this.router.navigate(['/registro']);
  }
}
