import { RoleRepository } from "../repositories/roleRepository";

export async function GetServiceResponse(){
    const repository = new RoleRepository();

    return repository.getAll()
}
