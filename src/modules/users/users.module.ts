import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PROTO_PATHS } from "kovryzhko-clinic-contracts";
import { UsersClientGrpc } from "./users.grpc";
import { GrpcModule } from "kovryzhko-clinic-common/dist/grpc/grpc.module";

@Module({
    imports: [GrpcModule.register(['USER_PACKAGE'])],
    controllers: [],
    providers: [UsersClientGrpc],
    exports: [UsersClientGrpc]
})
export class UsersModule { }