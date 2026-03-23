import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter, Histogram } from "prom-client";
import { Observable, tap } from "rxjs";

@Injectable()
export class GrpcMetricsInterceptor implements NestInterceptor {
    private readonly serviceName = 'auth'

    constructor(
        @InjectMetric('grpc_requests_total')
        private readonly counter: Counter<string>,

        @InjectMetric('grpc_request_duration_seconds')
        private readonly histogram: Histogram<string>,
    ) { }

    public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const handler = context.getHandler().name

        const endTimer = this.histogram.startTimer({
            service: this.serviceName,
            method: handler
        })

        return next.handle().pipe(
            tap({
                next: () => {
                    this.counter.inc({
                        service: this.serviceName,
                        method: handler,
                        status: "ok",
                    })
                    endTimer()
                },
                error: () => {
                    this.counter.inc({
                        service: this.serviceName,
                        method: handler,
                        status: "error",
                    })
                    endTimer()
                }
            })
        )
    }
}