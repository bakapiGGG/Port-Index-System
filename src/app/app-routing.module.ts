import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { ResearchComponent } from './research/research.component';
import { FAQComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { ExcelDatabaseComponent} from './excel-database/excel-database.component';
import { UserAccountComponent } from './user-account/user-account.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'about', component: AboutComponent},
  { path: 'home', component: HomeComponent},
  { path: 'stakeholders', component: StakeholdersComponent},
  { path: 'research', component: ResearchComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'FAQ', component: FAQComponent},
  { path: 'join-us', component: JoinUsComponent},
  { path: 'login-user', component: LoginUserComponent},
  { path: 'login-admin', component: LoginAdminComponent},
  { path: 'user-account', component: UserAccountComponent},
  { path: 'upload-excel', component: ExcelDatabaseComponent},
  { path: '', component: HomeComponent} // Default Route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
