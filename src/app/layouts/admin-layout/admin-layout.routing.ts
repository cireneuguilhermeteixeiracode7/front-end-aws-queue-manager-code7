import { Routes } from '@angular/router';

import { ManagerComponent } from '../../manager/manager.component';
import { CargaComponent } from '../../carga/carga.component';


export const AdminLayoutRoutes: Routes = [
  
    { path: 'aws',  component: ManagerComponent },
    { path: 'carga',  component: CargaComponent },
    // { path: 'clients',        component: ClientsComponent },
];
