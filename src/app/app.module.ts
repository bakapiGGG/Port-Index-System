import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { MenubarComponent } from './menubar/menubar.component'; // AG Grid Module
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { ResearchComponent } from './research/research.component';
import { FAQComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import { EfficiencyModalContentComponent } from './efficiency-modal-content/efficiency-modal-content.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SmartnessModalContentComponent } from './smartness-modal-content/smartness-modal-content.component';
import { GreennessModalContentComponent } from './greenness-modal-content/greenness-modal-content.component';
import { ResilienceModalContentComponent } from './resilience-modal-content/resilience-modal-content.component';
import { ScoreChartComponent } from './score-chart/score-chart.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAccountComponent } from './user-account/user-account.component';







@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenubarComponent,
    AboutComponent,
    HomeComponent,
    StakeholdersComponent,
    ResearchComponent,
    FAQComponent,
    ContactComponent,
    JoinUsComponent,
    LoginUserComponent,
    LoginAdminComponent,
    EfficiencyModalContentComponent,
    SmartnessModalContentComponent,
    GreennessModalContentComponent,
    ResilienceModalContentComponent,
    ScoreChartComponent,
    UserAccountComponent,
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
