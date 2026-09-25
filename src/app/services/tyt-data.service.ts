import { Injectable, signal, computed, inject } from '@angular/core';
import { Competencia } from '../models/competencia.model';
import { Pregunta } from '../models/pregunta.model';
import { ResultadoCompetencia, ResultadosAprendiz } from '../models/resultado.model';
import { AprendizService } from './aprendiz.service';

/**
 * TytDataService
 * --------------
 * Corazón del prototipo. Contiene TODA la lógica de:
 *  - Definición de las 5 competencias
 *  - Prueba de entrada: 15 preguntas (3 por competencia) ya presentadas,
 *    resultados por defecto (NO se simulan)
 *  - Prueba de salida: 15 preguntas (3 por competencia) que SÍ se simulan
 *  - Cálculo de puntajes (salida sobre 200) y comparaciones entrada vs salida
 *  - Persistencia de resultados en localStorage por aprendiz
 *
 * Los componentes solo consumen signals y llaman a métodos de alto nivel.
 */
@Injectable({ providedIn: 'root' })
export class TytDataService {
  private readonly aprendizService = inject(AprendizService);
  private readonly STORAGE_KEY = 'tyt_resultados';

  /** Puntaje máximo por competencia en la prueba de salida. */
  readonly PUNTAJE_MAX = 200;

  /** Definición de las 5 competencias del simulacro de salida. */
  readonly competencias: Competencia[] = [
    {
      id: 1,
      nombre: 'Competencia Ciudadana',
      descripcion: 'Convivencia, democracia y construcción de paz.',
      duracionMin: 18,
      icono: '🤝',
    },
    {
      id: 2,
      nombre: 'Razonamiento Cuantitativo',
      descripcion: 'Resolución de problemas numéricos y matemáticos.',
      duracionMin: 20,
      icono: '🔢',
    },
    {
      id: 3,
      nombre: 'Bilingüismo',
      descripcion: 'Comprensión y uso del inglés como lengua extranjera.',
      duracionMin: 16,
      icono: '🌐',
    },
    {
      id: 4,
      nombre: 'Comunicación Escrita',
      descripcion: 'Producción de textos claros y coherentes.',
      duracionMin: 20,
      icono: '✍️',
    },
    {
      id: 5,
      nombre: 'Lectura Crítica',
      descripcion: 'Comprensión, análisis y evaluación de textos.',
      duracionMin: 18,
      icono: '📖',
    },
  ];

  /**
   * Resultados de la prueba de ENTRADA por competencia (en %).
   * NO se simulan: son datos por defecto del prototipo.
   * La prueba de entrada tuvo 15 preguntas (3 por competencia).
   */
  private readonly entradaPorDefecto: Record<number, number> = {
    1: 85, // Ciudadana
    2: 75, // Razonamiento
    3: 65, // Bilingüismo
    4: 85, // Comunicación
    5: 80, // Lectura
  };

  /**
   * Preguntas de la prueba de SALIDA (3 por competencia = 15 total).
   * Son las que el aprendiz simula presentar.
   */
  private readonly preguntasSalida: Record<number, Pregunta[]> = {
    1: [
      {
        id: 101,
        texto:
          'En una comunidad se presenta un conflicto entre vecinos por el ruido. ¿Cuál es la mejor estrategia para resolverlo pacíficamente?',
        opciones: [
          { texto: 'Ignorar el problema hasta que desaparezca', esCorrecta: false },
          {
            texto: 'Conversar y llegar a acuerdos mediante el diálogo',
            esCorrecta: true,
          },
          { texto: 'Llamar a la policía sin mediar palabra', esCorrecta: false },
        ],
      },
      {
        id: 102,
        texto: 'La democracia participativa se caracteriza principalmente por:',
        opciones: [
          { texto: 'Decidir solo en elecciones cada 4 años', esCorrecta: false },
          {
            texto: 'Involucrar a los ciudadanos en las decisiones públicas',
            esCorrecta: true,
          },
          { texto: 'Eliminar toda forma de representación', esCorrecta: false },
        ],
      },
      {
        id: 103,
        texto: 'Un ejemplo de acción que promueve la paz en la convivencia es:',
        opciones: [
          { texto: 'Excluir a quien piensa diferente', esCorrecta: false },
          { texto: 'Difamar en redes sociales', esCorrecta: false },
          {
            texto: 'Escuchar activamente a las partes en conflicto',
            esCorrecta: true,
          },
        ],
      },
    ],
    2: [
      {
        id: 201,
        texto:
          'Si un producto cuesta $80.000 y tiene un descuento del 15%, ¿cuál es el precio final?',
        opciones: [
          { texto: '$68.000', esCorrecta: true },
          { texto: '$65.000', esCorrecta: false },
          { texto: '$72.000', esCorrecta: false },
        ],
      },
      {
        id: 202,
        texto: 'La probabilidad de obtener cara al lanzar una moneda equilibrada es:',
        opciones: [
          { texto: '25%', esCorrecta: false },
          { texto: '50%', esCorrecta: true },
          { texto: '75%', esCorrecta: false },
        ],
      },
      {
        id: 203,
        texto: 'Si 3 obreros construyen un muro en 6 días, ¿cuánto tardarán 6 obreros?',
        opciones: [
          { texto: '12 días', esCorrecta: false },
          { texto: '6 días', esCorrecta: false },
          { texto: '3 días', esCorrecta: true },
        ],
      },
    ],
    3: [
      {
        id: 301,
        texto: 'Choose the correct option: "She ___ to school every day."',
        opciones: [
          { texto: 'go', esCorrecta: false },
          { texto: 'goes', esCorrecta: true },
          { texto: 'going', esCorrecta: false },
        ],
      },
      {
        id: 302,
        texto: 'What is the meaning of "environment"?',
        opciones: [
          { texto: 'Entorno / medio ambiente', esCorrecta: true },
          { texto: 'Trabajo', esCorrecta: false },
          { texto: 'Comida', esCorrecta: false },
        ],
      },
      {
        id: 303,
        texto: 'Complete: "There ___ many books on the table."',
        opciones: [
          { texto: 'is', esCorrecta: false },
          { texto: 'are', esCorrecta: true },
          { texto: 'be', esCorrecta: false },
        ],
      },
    ],
    4: [
      {
        id: 401,
        texto: 'En un texto argumentativo, la tesis es:',
        opciones: [
          { texto: 'Una opinión sin importancia', esCorrecta: false },
          {
            texto: 'La idea principal que se defiende',
            esCorrecta: true,
          },
          { texto: 'La conclusión final únicamente', esCorrecta: false },
        ],
      },
      {
        id: 402,
        texto: '¿Cuál de estos conectores introduce una causa?',
        opciones: [
          { texto: 'Sin embargo', esCorrecta: false },
          { texto: 'Porque', esCorrecta: true },
          { texto: 'Por lo tanto', esCorrecta: false },
        ],
      },
      {
        id: 403,
        texto: 'Un texto claro y coherente debe evitar:',
        opciones: [
          { texto: 'La organización en párrafos', esCorrecta: false },
          { texto: 'Las ideas redundantes', esCorrecta: true },
          { texto: 'El uso de signos de puntuación', esCorrecta: false },
        ],
      },
    ],
    5: [
      {
        id: 501,
        texto:
          'En la frase "El político prometió bajar los impuestos, pero su historial dice lo contrario", el autor implica que:',
        opciones: [
          { texto: 'El político cumplirá su promesa', esCorrecta: false },
          {
            texto: 'La promesa del político es poco creíble',
            esCorrecta: true,
          },
          { texto: 'Los impuestos ya bajaron', esCorrecta: false },
        ],
      },
      {
        id: 502,
        texto: 'Leer críticamente significa:',
        opciones: [
          {
            texto: 'Analizar y cuestionar lo que el texto plantea',
            esCorrecta: true,
          },
          { texto: 'Aceptar todo lo que dice el texto', esCorrecta: false },
          { texto: 'Memorizar el texto palabra por palabra', esCorrecta: false },
        ],
      },
      {
        id: 503,
        texto: 'Un texto con " fines persuasivos ocultos" busca principalmente:',
        opciones: [
          { texto: 'Informar de manera neutral', esCorrecta: false },
          {
            texto: 'Influir en la opinión del lector sin que lo note',
            esCorrecta: true,
          },
          { texto: 'Entretener con humor', esCorrecta: false },
        ],
      },
    ],
  };

  /** Resultados completos del aprendiz actual (signal reactivo). */
  private readonly _resultados = signal<ResultadosAprendiz | null>(null);
  readonly resultados = this._resultados.asReadonly();

  /** Porcentaje global de la prueba de entrada (78% por defecto). */
  readonly entradaGlobal = computed(() => {
    const r = this._resultados();
    if (!r) return 0;
    const vals = r.porCompetencia.map((c) => c.entradaPorcentaje);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  });

  /** Promedio de las competencias de salida ya presentadas (sobre 200). */
  readonly promedioSalida = computed(() => {
    const r = this._resultados();
    if (!r) return 0;
    const presentadas = r.porCompetencia.filter((c) => c.completada);
    if (presentadas.length === 0) return 0;
    const suma = presentadas.reduce((a, c) => a + (c.salidaPuntaje ?? 0), 0);
    return Math.round(suma / presentadas.length);
  });

  /** Número de competencias de salida presentadas. */
  readonly competenciasPresentadas = computed(() => {
    const r = this._resultados();
    if (!r) return 0;
    return r.porCompetencia.filter((c) => c.completada).length;
  });

  /**
   * Datos para el gráfico "Puntaje de salida por competencia".
   * Solo incluye competencias presentadas. Devuelve {nombre, puntaje, pct}.
   */
  readonly graficoSalida = computed(() => {
    const r = this._resultados();
    if (!r) return [];
    return r.porCompetencia
      .filter((c) => c.completada)
      .map((c) => ({
        nombre: this.nombreCorto(c.nombreCompetencia),
        puntaje: c.salidaPuntaje ?? 0,
        pct: Math.round(((c.salidaPuntaje ?? 0) / this.PUNTAJE_MAX) * 100),
      }));
  });

  /**
   * Datos para el gráfico comparativo "Entrada vs Salida".
   * Normaliza ambos valores a % (0-100) para comparar en la misma escala.
   * entradaPct = % de la prueba de entrada.
   * salidaPct = (puntaje / 200) * 100.
   */
  readonly graficoComparacion = computed(() => {
    const r = this._resultados();
    if (!r) return [];
    return r.porCompetencia.map((c) => ({
      nombre: this.nombreCorto(c.nombreCompetencia),
      entradaPct: c.entradaPorcentaje,
      salidaPct: c.completada
        ? Math.round(((c.salidaPuntaje ?? 0) / this.PUNTAJE_MAX) * 100)
        : null,
      completada: c.completada,
    }));
  });

  /** Acorta el nombre de la competencia para los gráficos. */
  private nombreCorto(nombre: string): string {
    return nombre
      .replace('Competencia ', 'C. ')
      .replace('Razonamiento ', 'R. ')
      .replace('Comunicación ', 'Com. ')
      .replace('Lectura ', 'L. ');
  }

  constructor() {
    this.cargarResultados();
  }

  /** Devuelve la competencia por id. */
  obtenerCompetencia(id: number): Competencia | undefined {
    return this.competencias.find((c) => c.id === id);
  }

  /** Devuelve las preguntas de salida para una competencia. */
  obtenerPreguntasSalida(competenciaId: number): Pregunta[] {
    return this.preguntasSalida[competenciaId] ?? [];
  }

  /** Resultado de una competencia específica. */
  resultadoCompetencia(competenciaId: number): ResultadoCompetencia | undefined {
    return this._resultados()?.porCompetencia.find((c) => c.competenciaId === competenciaId);
  }

  /**
   * Registra el resultado de una competencia de salida.
   * @param competenciaId id de la competencia
   * @param respuestas array con el índice de opción elegida por pregunta
   */
  guardarResultadoSalida(competenciaId: number, respuestas: number[]): void {
    const r = this._resultados();
    if (!r) return;

    const preguntas = this.obtenerPreguntasSalida(competenciaId);
    let aciertos = 0;
    preguntas.forEach((p, i) => {
      const idx = respuestas[i];
      if (idx != null && p.opciones[idx]?.esCorrecta) aciertos++;
    });
    const total = preguntas.length;
    const puntaje = Math.round((aciertos / total) * this.PUNTAJE_MAX);

    const actualizados = r.porCompetencia.map((c) =>
      c.competenciaId === competenciaId
        ? {
            ...c,
            salidaPuntaje: puntaje,
            salidaAciertos: aciertos,
            salidaTotal: total,
            completada: true,
          }
        : c,
    );
    const nuevo: ResultadosAprendiz = { ...r, porCompetencia: actualizados };
    this._resultados.set(nuevo);
    this.persistir(nuevo);
  }

  /** Carga los resultados del aprendiz actual desde storage o crea los por defecto. */
  private cargarResultados(): void {
    const aprendiz = this.aprendizService.aprendiz();
    if (!aprendiz) {
      this._resultados.set(null);
      return;
    }

    const guardado = this.leerDeStorage(aprendiz.id);
    if (guardado) {
      this._resultados.set(guardado);
    } else {
      this._resultados.set(this.crearPorDefecto(aprendiz.id));
    }
  }

  /** Recarga los resultados (llamar tras login/registro del aprendiz). */
  refrescar(): void {
    this.cargarResultados();
  }

  /** Construye la estructura de resultados por defecto (entrada ya presentada, salida pendiente). */
  private crearPorDefecto(aprendizId: number): ResultadosAprendiz {
    const porCompetencia: ResultadoCompetencia[] = this.competencias.map((c) => ({
      competenciaId: c.id,
      nombreCompetencia: c.nombre,
      entradaPorcentaje: this.entradaPorDefecto[c.id] ?? 0,
      salidaPuntaje: null,
      salidaAciertos: null,
      salidaTotal: this.obtenerPreguntasSalida(c.id).length,
      completada: false,
    }));
    return { aprendizId, entradaGlobal: 0, porCompetencia };
  }

  private leerDeStorage(aprendizId: number): ResultadosAprendiz | null {
    const raw = localStorage.getItem(`${this.STORAGE_KEY}_${aprendizId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ResultadosAprendiz;
    } catch {
      return null;
    }
  }

  private persistir(r: ResultadosAprendiz): void {
    localStorage.setItem(`${this.STORAGE_KEY}_${r.aprendizId}`, JSON.stringify(r));
  }
}
