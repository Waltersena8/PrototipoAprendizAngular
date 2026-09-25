import { Routes } from '@angular/router';
import { Registro } from './componetns/registro/registro';
import { Home } from './componetns/home/home';
import { Evaluacion } from './componetns/evaluacion/evaluacion';
import { PruebaSalida } from './componetns/prueba-salida/prueba-salida';
import { Resultados } from './componetns/resultados/resultados';

export const routes: Routes = [
  { path: 'registro', component: Registro },
  { path: 'home', component: Home },
  { path: 'evaluacion', component: Evaluacion },
  { path: 'prueba/:competenciaId', component: PruebaSalida },
  { path: 'resultados', component: Resultados },
  { path: '', redirectTo: '/registro', pathMatch: 'full' },
  { path: '**', redirectTo: '/registro' },
];
