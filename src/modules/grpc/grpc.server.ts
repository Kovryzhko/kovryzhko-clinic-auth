import { INestApplication } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { grpcLoader, grpcPackages, grpcProtoPaths } from "./grpc.options";
import { env } from "process";

export function createGrpcServer(app: INestApplication) {
    const url = `${env.GRPC_HOST}:${env.GRPC_PORT}`

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: grpcPackages,
            protoPath: grpcProtoPaths,
            url: url,
            loader: grpcLoader
        }
    })
}