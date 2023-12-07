import { Component } from '@angular/core';
import { AccountService } from '../services/account.service';
import { Account } from '../../model/account-model';
import { Address } from 'src/app/model/address-model';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {
  account: any;

  constructor(private AccountService: AccountService) {  }

  ngOnInit() {
    this.getAccountData();
  }

  getAccountData() {
    this.AccountService.getAccountData().subscribe((data: any) => {
      this.account = data;
    });
  }

  onSubmit() {
    this.AccountService.updateAccountData(this.account).subscribe((response: any) => {
      console.log(this.account.role);
      this.getAccountData();
    });
  }

  onCancel() {
    this.getAccountData();
  };

  onDelete() {
  };
}
