import { Injectable, signal, computed } from '@angular/core';
import { Aprendiz } from '../models/aprendiz.model';

/**
 * AprendizService
 * ---------------
 * Gestiona el ciclo de vida del aprendiz en el prototipo:
 *  - Registra al aprendiz en el formulario (excepción al login del wireframe)
 *  - Persiste los datos en localStorage
 *  - Expone signals para que los componentes reaccionen sin lógica propia
 *
 * Toda la lógica de sesión vive aquí; los componentes solo leen/escriben.
 */
@Injectable({ providedIn: 'root' })
export class AprendizService {
  private readonly STORAGE_KEY = 'tyt_aprendiz';

  /** Aprendiz actualmente registrado (null si no hay sesión). */
  private readonly _aprendiz = signal<Aprendiz | null>(this.leerDeStorage());
  readonly aprendiz = this._aprendiz.asReadonly();

  /** True si ya hay un aprendiz registrado en sesión. */
  readonly estaRegistrado = computed(() => this._aprendiz() !== null);

  /**
   * Guarda los datos del aprendiz (viene del formulario de registro).
   * Devuelve el aprendiz guardado.
   */
  registrar(datos: Omit<Aprendiz, 'id'>): Aprendiz {
    const aprendiz: Aprendiz = {
      ...datos,
      id: Date.now(), // id pseudo-único para el prototipo
    };
    this._aprendiz.set(aprendiz);
    this.escribirEnStorage(aprendiz);
    return aprendiz;
  }

  /** Cierra la sesión y limpia el storage. */
  cerrarSesion(): void {
    this._aprendiz.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /** Devuelve las iniciales del nombre para el avatar. */
  iniciales(): string {
    const a = this._aprendiz();
    if (!a) return '?';
    return a.nombreCompleto
      .split(' ')
      .filter((p) => p.length > 0)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  private leerDeStorage(): Aprendiz | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Aprendiz;
    } catch {
      return null;
    }
  }

  private escribirEnStorage(aprendiz: Aprendiz): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(aprendiz));
  }
}
