/** Pregunta de opción múltiple usada en entrada y salida. */
export interface OpcionRespuesta {
  texto: string;
  esCorrecta: boolean;
}

export interface Pregunta {
  id: number;
  texto: string;
  opciones: OpcionRespuesta[];
}
