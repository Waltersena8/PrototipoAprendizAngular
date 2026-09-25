import { Component, Input, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TytDataService } from '../../services/tyt-data.service';
import { Competencia } from '../../models/competencia.model';

@Component({
  selector: 'app-prueba-salida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './prueba-salida.html',
  styleUrl: './prueba-salida.css',
})
export class PruebaSalida {
  readonly tyt = inject(TytDataService);

  /** Recibido desde la ruta: /prueba/:competenciaId */
  @Input() set competenciaId(value: string | number) {
    const id = Number(value);
    this._competencia.set(this.tyt.obtenerCompetencia(id));
    this._preguntas.set(this.tyt.obtenerPreguntasSalida(id));
    this._respuestas.set(this._preguntas().map(() => null));
    // Si ya estaba presentada, cargar su resultado
    this._resultado.set(this.tyt.resultadoCompetencia(id) ?? null);
    this._enviada.set(this._resultado()?.completada ?? false);
  }

  private readonly _competencia = signal<Competencia | undefined>(undefined);
  private readonly _preguntas = signal(this.tyt.obtenerPreguntasSalida(0));
  private readonly _respuestas = signal<(number | null)[]>([]);
  private readonly _enviada = signal(false);
  private readonly _resultado = signal(this.tyt.resultadoCompetencia(0) ?? null);

  readonly competencia = this._competencia.asReadonly();
  readonly preguntas = this._preguntas.asReadonly();
  readonly respuestas = this._respuestas.asReadonly();
  readonly enviada = this._enviada.asReadonly();
  readonly resultado = this._resultado.asReadonly();

  /** Cuántas preguntas faltan por responder. */
  readonly pendientes = computed(() => this._respuestas().filter((r) => r === null).length);

  /** Selecciona una opción para una pregunta. */
  seleccionar(preguntaIdx: number, opcionIdx: number): void {
    if (this._enviada()) return;
    const act = [...this._respuestas()];
    act[preguntaIdx] = opcionIdx;
    this._respuestas.set(act);
  }

  /** Envía las respuestas al service para calcular el puntaje. */
  enviar(): void {
    const comp = this._competencia();
    if (!comp) return;
    const resp = this._respuestas().map((r) => r ?? -1);
    this.tyt.guardarResultadoSalida(comp.id, resp);
    this._resultado.set(this.tyt.resultadoCompetencia(comp.id) ?? null);
    this._enviada.set(true);
  }

  /** Reinicia la prueba para volver a presentarla (solo si ya estaba completada). */
  repetir(): void {
    this._respuestas.set(this._preguntas().map(() => null));
    this._enviada.set(false);
  }
}
