import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

export class EuchreServerStack extends Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const webSocketApiHandler = new NodejsFunction(
            this,
            "EuchreLambdaFunction",
            {
                entry: "../../server/lambdas/handler.ts",
                handler: "handler",
                environment: {},
            },
        );

        const webSocketApi = new apigatewayv2.WebSocketApi(
            this,
            "EuchreWebSocketApi",
            {
                connectRouteOptions: {
                    integration: new WebSocketLambdaIntegration(
                        "integration",
                        webSocketApiHandler,
                    ),
                },
                disconnectRouteOptions: {
                    integration: new WebSocketLambdaIntegration(
                        "integration",
                        webSocketApiHandler,
                    ),
                },
                defaultRouteOptions: {
                    integration: new WebSocketLambdaIntegration(
                        "integration",
                        webSocketApiHandler,
                    ),
                },
            },
        );
    }
}
