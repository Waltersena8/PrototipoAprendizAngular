import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AprendizService } from '../../services/aprendiz.service';
import { TytDataService } from '../../services/tyt-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly aprendizService = inject(AprendizService);
  readonly tyt = inject(TytDataService);

  readonly aprendiz = this.aprendizService.aprendiz;
  readonly presentadas = this.tyt.competenciasPresentadas;
  readonly total = this.tyt.competencias.length;

  // Estado del simulacro: pendiente si no se han presentado todas
  readonly simulacroPendiente = computed(() => this.presentadas() < this.total);
}
