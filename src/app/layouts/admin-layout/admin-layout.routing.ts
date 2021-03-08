import { Routes } from '@angular/router';

import { ManagerComponent } from '../../manager/manager.component';
import { ClientsComponent } from '../../clients/clients.component';


export const AdminLayoutRoutes: Routes = [
  
    { path: 'aws',  component: ManagerComponent },
    // { path: 'clients',        component: ClientsComponent },
];
