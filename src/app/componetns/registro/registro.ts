import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AprendizService } from '../../services/aprendiz.service';
import { TytDataService } from '../../services/tyt-data.service';
import { Aprendiz } from '../../models/aprendiz.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly router = inject(Router);
  private readonly aprendizService = inject(AprendizService);
  private readonly tyt = inject(TytDataService);

  // Campos del formulario (ngModel)
  nombreCompleto = '';
  tipoDocumento = 'Cédula de ciudadanía';
  numeroDocumento = '';
  correo = '';
  nombreTecnologo = 'Análisis y Desarrollo de Software (ADSO)';
  ficha: number | null = null;
  trimestre = 'Trimestre VI';
  aceptaDatos = false;

  error = signal('');

  tiposDocumento = [
    'Cédula de ciudadanía',
    'Cédula de extranjería',
    'Tarjeta de identidad',
    'Pasaporte',
  ];

  tecnologos = [
    'Análisis y Desarrollo de Software (ADSO)',
    'Contabilidad y Finanzas',
    'Mantenimiento de Equipos de Cómputo',
    'Programación de Software',
  ];

  trimestres = [
    'Trimestre I',
    'Trimestre II',
    'Trimestre III',
    'Trimestre IV',
    'Trimestre V',
    'Trimestre VI',
    'Trimestre VII',
  ];

  enviar(): void {
    // Validación mínima (la lógica pesada vive en el service)
    if (
      !this.nombreCompleto.trim() ||
      !this.numeroDocumento.trim() ||
      !this.correo.trim() ||
      this.ficha == null ||
      !this.aceptaDatos
    ) {
      this.error.set('Completa todos los campos y acepta el tratamiento de datos.');
      return;
    }

    const aprendiz: Omit<Aprendiz, 'id'> = {
      nombreCompleto: this.nombreCompleto.trim(),
      tipoDocumento: this.tipoDocumento,
      numeroDocumento: this.numeroDocumento.trim(),
      correo: this.correo.trim(),
      nombreTecnologo: this.nombreTecnologo,
      ficha: this.ficha,
      trimestre: this.trimestre,
      aceptaDatos: this.aceptaDatos,
    };

    this.aprendizService.registrar(aprendiz);
    this.tyt.refrescar(); // inicializa resultados por defecto
    this.router.navigate(['/home']);
  }
}
