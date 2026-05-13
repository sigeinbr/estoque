import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

interface entity {
  created_by?: string,
  created_at?: Date,
  updated_by?: string,
  updated_at?: Date
}

@Component({
  selector: 'audit-info',
  standalone: true,
  imports: [
    BadgeModule,
    OverlayPanelModule,
    DatePipe,
    ButtonModule
  ],
  templateUrl: './audit-info.component.html',
  styleUrl: './audit-info.component.scss'
})
export class AuditInfoComponent {
  @Input() entity: entity = {};
}
