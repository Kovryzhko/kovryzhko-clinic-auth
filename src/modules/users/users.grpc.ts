import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { UserServiceClient, CreateUserRequest } from 'kovryzhko-clinic-contracts/gen/user'
import { AbstractGrpcClient } from 'kovryzhko-clinic-common/dist/grpc/abstarct-grpc.client'
import { InjectGrpcClient } from 'kovryzhko-clinic-common/dist/grpc/decorators/inject-grpc-client.decorator'

@Injectable()
export class UsersClientGrpc extends AbstractGrpcClient<UserServiceClient> {
    constructor(@InjectGrpcClient('USER_PACKAGE') client: ClientGrpc) {
        super(client, 'UserService')
    }
}