import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TytDataService } from '../../services/tyt-data.service';
import { AprendizService } from '../../services/aprendiz.service';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados {
  readonly tyt = inject(TytDataService);
  readonly aprendizService = inject(AprendizService);

  readonly entradaGlobal = this.tyt.entradaGlobal;
  readonly promedioSalida = this.tyt.promedioSalida;
  readonly presentadas = this.tyt.competenciasPresentadas;
  readonly totalCompetencias = this.tyt.competencias.length;
  readonly graficoSalida = this.tyt.graficoSalida;
  readonly graficoComparacion = this.tyt.graficoComparacion;
  readonly PUNTAJE_MAX = this.tyt.PUNTAJE_MAX;

  /** Color de la barra según porcentaje (regla visual simple). */
  colorBarra(pct: number): string {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 60) return 'var(--sena-green)';
    if (pct >= 40) return 'var(--warning)';
    return 'var(--danger)';
  }
}
