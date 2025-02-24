import { Injectable } from "@nestjs/common";
import { Prisma as db} from "src/lib/db/dbConfig";
import { Prisma, Sessions } from "@prisma/client";
import { handleDatabaseOperations } from "src/common/utils/utils";

@Injectable()
export class SessionRepositories {
    async create(data: Prisma.SessionsCreateInput): Promise<Sessions | null> {
        return handleDatabaseOperations(() => db.sessions.create({ data }));
    }

    async findOne(where: Prisma.SessionsWhereUniqueInput): Promise<Sessions | null> {
        return handleDatabaseOperations(() => db.sessions.findUnique({ where }));
    }

    async findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.SessionsWhereInput;
        orderBy?: Prisma.SessionsOrderByWithRelationInput;
    }): Promise<Sessions[] | null> {
        return handleDatabaseOperations(() => db.sessions.findMany(params));
    }

    async update(params: {
        where: Prisma.SessionsWhereUniqueInput;
        data: Prisma.SessionsUpdateInput;
    }): Promise<Sessions | null> {
        const { where, data } = params;
        return handleDatabaseOperations(() => db.sessions.update({ where, data }));
    }

    async delete(where: Prisma.SessionsWhereUniqueInput): Promise<Sessions | null> {
        return handleDatabaseOperations(() => db.sessions.delete({ where }));
    }
}