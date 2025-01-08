import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightComponent } from './components/flight/flight.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ConfirmResetPasswordComponent } from './components/confirm-reset-password/confirm-reset-password.component';
import { LayoutComponent } from './components/layout/layout.component';

const routes: Routes = [
  // Routes that use the LayoutComponent
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default redirect
      { path: 'home', component: HomeComponent, data: { public: true } }, // Public home page
      { path: 'flights', component: FlightComponent, canActivate: [authGuard] }, // Protected route
    ],
  },

  // Standalone routes (no LayoutComponent)
  { path: 'login', component: LoginComponent, data: { public: true } }, // Login page
  { path: 'register', component: RegisterComponent, data: { public: true } }, // Registration page
  { path: 'reset-password', component: ResetPasswordComponent, data: { public: true } }, // Password reset
  { path: 'confirm-reset-password', component: ConfirmResetPasswordComponent, data: { public: true } }, // Confirm reset

  // Wildcard route for 404
  { path: '**', redirectTo: 'home' }, // Redirect unknown routes to home
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
