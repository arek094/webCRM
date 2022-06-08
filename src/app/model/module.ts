import { ObjectAccess } from "./object-access";

export interface ModuleAccess {
    object_access: ObjectAccess[];
    modul_nazwa: string;
    modul_id?:number;
}