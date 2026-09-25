/**
 * Resultados del aprendiz.
 * - entrada: 15 preguntas, 3 por cada competencia → % por competencia y % global
 * - salida: 5 competencias, puntaje sobre 200 cada una
 */
export interface ResultadoCompetencia {
  competenciaId: number;
  nombreCompetencia: string;
  // Entrada: porcentaje (0-100) de aciertos de las 3 preguntas asociadas
  entradaPorcentaje: number;
  // Salida: puntaje sobre 200 (0-200). null si no se ha presentado
  salidaPuntaje: number | null;
  // Salida: número de aciertos sobre el total de preguntas de salida
  salidaAciertos: number | null;
  salidaTotal: number;
  completada: boolean;
}

export interface ResultadosAprendiz {
  aprendizId: number;
  // Porcentaje global de la prueba de entrada (promedio de las 5 competencias)
  entradaGlobal: number;
  // Resultado por competencia
  porCompetencia: ResultadoCompetencia[];
}
