import { Password } from "primeng/password";
import { Role } from "./role";

export interface Account {
    id: number;
    email: string;
    password: Password;
    isBlocked: boolean;
    isActivated: boolean;
    role: Role;
}
