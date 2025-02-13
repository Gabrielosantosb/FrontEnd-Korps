import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private message: NzMessageService) {}

  successMessage(title: string): void {
    this.message.success(title);
  }

  errorMessage(title: string): void {
    this.message.error(title);
  }

  infoMessage(title: string): void {
    this.message.info(title);
  }

  warningMessage(title: string): void {
    this.message.warning(title);
  }
}
