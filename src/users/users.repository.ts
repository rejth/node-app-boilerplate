import { UserModel } from "@prisma/client";
import { inject, injectable } from "inversify";
import 'reflect-metadata';

import { TYPES } from "../types";
import { IPrismaService } from "../database/IPrismaService";
import { IUserRepository } from "./interfaces/IUserRepository";
import { User } from "./user.entity";

@injectable()
export class UserRepository implements IUserRepository {
    constructor(@inject(TYPES.IPrismaService) private _prismaService: IPrismaService) {}

    public async create({ name, email, password }: User): Promise<UserModel> {
        return this._prismaService.client.userModel.create({
            data: {
                name, 
                email, 
                password
            }
        })
    }

    public async find(email: string): Promise<UserModel | null> {
        return this._prismaService.client.userModel.findFirst({
            where: {
                email
            }
        })
    }
}