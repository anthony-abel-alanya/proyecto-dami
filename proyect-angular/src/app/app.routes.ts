import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AppLayoutComponent } from './layout/app-layout/app-layout';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ListaMascotasAdminComponent } from './components/mascotas/lista-mascotas/lista-mascotas';
import { FormMascotaComponent } from './components/mascotas/form-mascota/form-mascota';
import { ListaSolicitudesAdminComponent } from './components/solicitudes/lista-solicitudes/lista-solicitudes';
import { DetalleSolicitudComponent } from './components/solicitudes/detalle-solicitud/detalle-solicitud';
import { CategoriasComponent } from './components/categorias/categorias';
import { AdoptantesComponent } from './components/usuarios/adoptantes/adoptantes';
import { TrabajadoresComponent } from './components/usuarios/trabajadores/trabajadores';
import { PerfilComponent } from './components/perfil/perfil';
import { AccessDeniedComponent } from './components/access-denied/access-denied';

const staffRoles = ['ROLE_ADMIN', 'ROLE_TRABAJADOR'];
const adminRoles = ['ROLE_ADMIN'];

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'acceso-denegado', component: AccessDeniedComponent },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'mascotas', component: ListaMascotasAdminComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'mascotas/nuevo', component: FormMascotaComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'mascotas/editar/:id', component: FormMascotaComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'solicitudes', component: ListaSolicitudesAdminComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'solicitudes/:id', component: DetalleSolicitudComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
      { path: 'categorias', component: CategoriasComponent, canActivate: [roleGuard], data: { roles: adminRoles } },
      { path: 'usuarios/adoptantes', component: AdoptantesComponent, canActivate: [roleGuard], data: { roles: adminRoles } },
      { path: 'usuarios/trabajadores', component: TrabajadoresComponent, canActivate: [roleGuard], data: { roles: adminRoles } },
      { path: 'perfil', component: PerfilComponent, canActivate: [roleGuard], data: { roles: staffRoles } },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
