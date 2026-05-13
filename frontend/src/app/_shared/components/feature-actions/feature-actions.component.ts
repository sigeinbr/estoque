import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'feature-actions',
  standalone: true,
  imports: [MenuModule, ButtonModule, TooltipModule],
  templateUrl: './feature-actions.component.html',
})
export class FeatureActionsComponent {
  // External properties
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Input() actions: MenuItem[] = [];
  @Output() onAction = new EventEmitter();

  // Events methods
  onEditClick() {
    this.onEdit.emit();
  }

  onDeleteClick() {
    this.onDelete.emit();
  }

  onActionClick() {
    this.onAction.emit();
  }
}
