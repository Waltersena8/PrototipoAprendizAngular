/** Datos del aprendiz que se registran en el formulario (excepción al login). */
export interface Aprendiz {
  id: number;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  correo: string;
  nombreTecnologo: string;
  ficha: number;
  trimestre: string;
  aceptaDatos: boolean;
}
