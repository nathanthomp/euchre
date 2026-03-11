import { App, Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as logs from "aws-cdk-lib/aws-logs";

export class EuchreServerStack extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);

        /**
         * Lambda Function
         */

        const webSocketApiHandler = new NodejsFunction(
            this,
            "EuchreWebSocketLambdaFunction",
            {
                functionName: "EuchreWebSocketLambdaFunction",
                entry: "../server/src/lambdas/websocket.handler.ts",
                handler: "handler",
                runtime: Runtime.NODEJS_20_X,
                environment: {},
            },
        );

        const restApiHandler = new NodejsFunction(
            this,
            "EuchreRestLambdaFunction",
            {
                functionName: "EuchreRestLambdaFunction",
                entry: "../server/src/lambdas/rest.handler.ts",
                handler: "handler",
                runtime: Runtime.NODEJS_20_X,
                environment: {},
            },
        );

        /**
         * Rest api
         */
        const restApi = new apigateway.RestApi(this, "EuchreRestApi", {
            restApiName: "EuchreRestApi",
            deployOptions: {
                stageName: "main",
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apigateway.Cors.ALL_ORIGINS,
                allowMethods: apigateway.Cors.ALL_METHODS,
            },
        });

        const actionResource = restApi.root.addResource("game");
        actionResource.addMethod(
            "GET",
            new apigateway.LambdaIntegration(restApiHandler),
        );
        actionResource.addMethod(
            "POST",
            new apigateway.LambdaIntegration(restApiHandler),
        );

        /**
         * Web Socket api
         */

        const webSocketApiIntegration = new WebSocketLambdaIntegration(
            "integration",
            webSocketApiHandler,
        );

        const webSocketApi = new apigatewayv2.WebSocketApi(
            this,
            "EuchreWebSocketApi",
            {
                apiName: "EuchreWebSocketApi",
                routeSelectionExpression: "$request.body.action",
                connectRouteOptions: {
                    integration: webSocketApiIntegration,
                },
                disconnectRouteOptions: {
                    integration: webSocketApiIntegration,
                },
                defaultRouteOptions: {
                    integration: webSocketApiIntegration,
                },
            },
        );

        // const webSocketApiLogGroup = new logs.LogGroup(
        //     this,
        //     "EuchreAccessLogs",
        //     {
        //         logGroupName: "/aws/apigateway/EuchreWebSocketApi",
        //         retention: logs.RetentionDays.ONE_DAY,
        //     },
        // );

        const webSocketApiStage = new apigatewayv2.CfnStage(
            this,
            "EuchreWebSocketApiStage",
            {
                apiId: webSocketApi.apiId,
                stageName: "main",
                autoDeploy: true,
                // accessLogSettings: {
                //     destinationArn: webSocketApiLogGroup.logGroupArn,
                //     format: "$context.requestId: $context.eventType $context.connectionId - $context.routeKey",
                // },
            },
        );

        /**
         * Dynamo table
         */
        const table = new dynamodb.Table(this, "EuchreTable", {
            tableName: "EuchreTable",
            partitionKey: {
                name: "pk",
                type: dynamodb.AttributeType.STRING,
            },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        /**
         * Permissions
         */

        webSocketApiHandler.addPermission("ApiGatewayInvoke", {
            principal: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        });

        webSocketApi.grantManageConnections(webSocketApiHandler);

        // webSocketApiLogGroup.grantWrite(
        //     new iam.ServicePrincipal("apigateway.amazonaws.com"),
        // );

        table.grantReadWriteData(webSocketApiHandler);
        table.grantReadWriteData(restApiHandler);
    }
}
