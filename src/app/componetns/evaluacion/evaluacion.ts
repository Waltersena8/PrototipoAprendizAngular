import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TytDataService } from '../../services/tyt-data.service';

@Component({
  selector: 'app-evaluacion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './evaluacion.html',
  styleUrl: './evaluacion.css',
})
export class Evaluacion {
  readonly tyt = inject(TytDataService);

  readonly competencias = this.tyt.competencias;
  readonly entradaGlobal = this.tyt.entradaGlobal;
  readonly presentadas = this.tyt.competenciasPresentadas;

  /** Devuelve el resultado (ya presentado / pendiente) de una competencia. */
  estadoCompetencia(id: number) {
    return this.tyt.resultadoCompetencia(id);
  }

  /** Resultados por competencia de la prueba de entrada (15 preguntas, 3 c/u). */
  readonly entradaPorCompetencia = computed(() => this.tyt.resultados()?.porCompetencia ?? []);
}
