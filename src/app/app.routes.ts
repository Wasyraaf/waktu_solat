import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MasjidComponent } from './pages/masjid/masjid.component';

export const routes: Routes = [

{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
},
{
    path: 'home',
    component: HomepageComponent,
},
{
    path: 'masjid',
    component: MasjidComponent,
},
];
