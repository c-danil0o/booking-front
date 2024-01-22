import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { HostService } from '../services/host.service';
import { GuestService } from '../services/guest.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { countries } from '../register/countries';
import { Address } from 'src/app/model/address-model';
import { E } from '@angular/cdk/keycodes';
import { AccountService } from '../services/account.service';
import { NewPassword } from 'src/app/model/password-change-model';
import { error } from '@angular/compiler-cli/src/transformers/util';
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit{
  account: any;
  editAccountForm: FormGroup;
  changePasswordForm: FormGroup;
  formChanged: boolean = false;
  constructor(private router: Router, private authService: AuthService, private route: ActivatedRoute, private accountService: AccountService, private hostService: HostService, private guestService: GuestService, private messageService: MessageService) {}


  ngOnInit() {
    this.initializeEditAccountForm();
    this.initializeChangePasswordForm();


    this.route.params.subscribe(params => {
      const userId = params['id'];
      if (this.authService.getRole().toUpperCase() === 'ROLE_HOST') {
        this.hostService.findById(userId).subscribe(data => {
          this.account = data;
          this.loaded = true;
          this.patchEditAccountForm();
        });
      } else {
       this.guestService.findById(userId).subscribe(data => {
          this.account = data;
          this.loaded = true;
          this.patchEditAccountForm();
        });
      }
    });
  }
  printff(): void{
    console.log("jebo te alah")
  }

  private initializeEditAccountForm(): void {
    this.editAccountForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.max(30)]),
      lastname: new FormControl('', [Validators.required, Validators.max(30)]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$")]),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      number: new FormControl('', Validators.required),
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email],),
      country: new FormControl('', [Validators.required])
    });
  }

  private initializeChangePasswordForm(): void {
    this.changePasswordForm = new FormGroup({
      oldpassword: new FormControl('', Validators.required),
      newpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmedpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }


  selectedCountry = {"name": "12", "code": "23"};
  protected readonly countries = countries;
  loaded: boolean = false;

  updateAccount(){
    const updatedAccountData = {
      ...this.account,
      firstName: this.editAccountForm.value.firstname,
      lastName: this.editAccountForm.value.lastname,
      phone: this.editAccountForm.value.phone,
      email: this.editAccountForm.controls['email'].value,
      address: {
        ...this.account.address,
        street: this.editAccountForm.value.street,
        city: this.editAccountForm.value.city,
        number: this.editAccountForm.value.number,
        country: this.editAccountForm.value.country
      }
    };
    if (this.authService.getRole().toUpperCase() === 'ROLE_HOST'){
      this.hostService.update(updatedAccountData).subscribe(
        (responseAccount: any) => {
          this.account = responseAccount;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            key: 'bc',
            detail: 'Account successfully updated!',
            life: 2000
          });
          this.formChanged = false;
        },
        error => {
          console.error(`Error updating account: ${error}`)
        }
      )
    }else{
      this.guestService.update(updatedAccountData).subscribe(
        (responseAccount: any) => {
          this.account = responseAccount;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            key: 'bc',
            detail: 'Account successfully updated!',
            life: 2000
          });
          this.formChanged = false;
        },
        error => {
          console.error(`Error updating account: ${error}`)
        }
      )
    }

  }
  onFormSubmit(): void {
    if(this.editAccountForm.valid) {
      this.updateAccount();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        key: 'bc',
        detail: 'Form is not valid!',
        life: 2000
      })

      this.editAccountForm.markAllAsTouched();
      for (const key of Object.keys(this.editAccountForm.controls)) {
        if (this.editAccountForm.controls[key].invalid) {
          console.log(`${key}:`, this.editAccountForm.controls[key].errors);
        }
      }
    }
  }

  onCancel(): void {
    this.editAccountForm.reset();
    this.patchEditAccountForm();
    this.formChanged = false;
  }

  onDelete(): void {
    if(confirm('Are you sure you want to delete your account?')) {
      const deleteService = this.authService.getRole().toUpperCase() === 'ROLE_HOST' ? this.hostService : this.guestService;
      this.authService.logout().subscribe({
        next: (_) => {
          localStorage.removeItem('user');
          this.authService.setUser();
        }
      })
      deleteService.deleteAccount(this.account.id).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            key: 'bc',
            detail: 'Account successfully deleted!!',
            life: 2000
          })
          this.router.navigate(['/']);
        },
        error => {
          console.log("Error deleting account " + JSON.stringify(error))
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            key: 'bc',
            detail: 'Error deleting account!',
            life: 2000
          })
        }
      )
    }
  }

  onChangePassword(): void {
    if(this.changePasswordForm.value.newpassword === this.changePasswordForm.value.confirmedpassword) {
      const newPassword: NewPassword = {
        email: this.account.email,
        oldPassword: this.changePasswordForm.value.oldpassword,
        newPassword: this.changePasswordForm.value.newpassword,
        confirmedPassword: this.changePasswordForm.value.confirmedpassword
      }

      this.accountService.changePassword(newPassword).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            key: 'bc',
            detail: 'Password updated successfully\nYou\'ll be logged out so you can login with new credentials',
            life: 2000
          })
          this.authService.logout().subscribe({
            next: (_) => {
              localStorage.removeItem('user');
              this.authService.setUser();
              this.router.navigate(['/login']);
            }
          })
        },
        error => {
          console.log("Error: " + error);
          console.error(`Error changing password: ${error}`)
        }
      )
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        key: 'bc',
        detail: 'Incorrectly filled in data.\nPlease try again.',
        life: 2000
      })

      // print all invalid fields in the console
      this.editAccountForm.markAllAsTouched();
      for (const key of Object.keys(this.editAccountForm.controls)) {
        if (this.editAccountForm.controls[key].invalid) {
          console.log(`${key}:`, this.editAccountForm.controls[key].errors);
        }
      }
    }
  }

  patchEditAccountForm(): void {
    this.editAccountForm.patchValue({
      firstname: this.account.firstName,
      lastname: this.account.lastName,
      phone: this.account.phone,
      street: this.account.address.street,
      city: this.account.address.city,
      number: this.account.address.number,
      email: this.account.email,
      country: this.account.address.country
    })
    this.editAccountForm.valueChanges.subscribe(() => {
      this.formChanged = true;
    })
  }
}
