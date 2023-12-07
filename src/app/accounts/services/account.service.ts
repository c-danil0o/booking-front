import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Account } from "src/app/model/account-model";
import { environment } from "src/env/env";

@Injectable({
    providedIn: 'root'
})

export class AccountService {

    constructor(private http: HttpClient) { }

    getAccountData() {
        return this.http.get<Account>(environment.apiHost + 'api/guests/7');
    }

    updateAccountData(account: any) {
        return this.http.put(environment.apiHost + 'api/accounts/update', account);
    }
}
