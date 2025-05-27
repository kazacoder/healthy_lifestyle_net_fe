import {Component, Input, OnInit} from '@angular/core';
import {PublicationType} from '../../../../../types/publication.type';
import {NgForOf, NgIf} from '@angular/common';
import {CommonUtils} from '../../../utils/common-utils';
import {RouterLink} from '@angular/router';
import {ConfirmModalComponent} from '../../modals/confirm-modal/confirm-modal.component';
import {WindowsUtils} from '../../../utils/windows-utils';

@Component({
  selector: 'publication-card',
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    ConfirmModalComponent
  ],
  standalone: true,
  templateUrl: './publication-card.component.html',
  styleUrl: './publication-card.component.scss'
})
export class PublicationCardComponent implements OnInit {
  @Input()
  publication: PublicationType | null = null;
  day = 0;
  month = '';
  tickets = ''
  isOpenConfirmModal: boolean = false

  ngOnInit(): void {
    this.day = new Date(this.publication!.date).getDate();
    this.month = CommonUtils.getRussianMonthName(this.publication!.date);
    this.tickets = CommonUtils.getTicketWord(this.publication!.ticket_amount)
  }

  toggleDeleteModal(val: boolean) {
    this.isOpenConfirmModal = val;
    WindowsUtils.fixBody(val);
  }

  deletePublication() {
    console.log('deleting')
  }
}
