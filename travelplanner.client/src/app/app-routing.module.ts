import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightComponent } from './components/flight/flight.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirect root to home
  { path: 'home', component: HomeComponent }, // Home page
  { path: 'flights', component: FlightComponent, canActivate: [authGuard] }, // Protected route
  { path: 'login', component: LoginComponent }, // Login page
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'home' } // Wildcard route
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
