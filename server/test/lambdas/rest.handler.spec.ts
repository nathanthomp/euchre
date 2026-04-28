import {
    DynamoDBClient,
    ItemResponse$,
    QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { AwsClientStub, mockClient } from "aws-sdk-client-mock";
import { RestEvent, RestHandler } from "../../src/lambdas/rest.handler";
import { EntityManager } from "../../src/entity";
import { marshall } from "@aws-sdk/util-dynamodb";

describe("RestHandler", () => {
    let mockDynamoClient: AwsClientStub<DynamoDBClient>;
    let entityManager: EntityManager;

    beforeEach(() => {
        mockDynamoClient = mockClient(DynamoDBClient);
        mockDynamoClient.reset();

        const realDynamoClient = new DynamoDBClient({});
        entityManager = new EntityManager(realDynamoClient);
    });

    afterEach(() => {
        mockDynamoClient.reset();
    });

    describe("should handle GET request ", () => {
        it("with status code 200", async () => {
            const mockGamecode = "1234-5678";
            const mockState = "WAITING";
            const mockPlayers = [
                {
                    username: "player1",
                    connectionId: "12",
                },
                {
                    username: "player2",
                    connectionId: "34",
                },
                {
                    username: "player3",
                    connectionId: "56",
                },
                {
                    username: "player4",
                    connectionId: "78",
                },
            ];

            const item = mockDynamoClient.on(QueryCommand).resolves({
                Items: [
                    marshall({
                        gamecode: mockGamecode,
                        state: mockState,
                        players: mockPlayers,
                    }),
                ],
            });

            const response = await new RestHandler(entityManager).handle(
                getMockGetEvent(mockGamecode),
            );

            const calls = mockDynamoClient.commandCalls(QueryCommand);
            expect(calls.length).toBe(1);
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body)).toBeTruthy();
        });
    });

    describe("should handle POST request ", () => {
        it("with status code 200", async () => {
            mockDynamoClient.on(QueryCommand).resolves({});

            const mockGamecode = "1234-5678";
            const response = new RestHandler(entityManager).handle(
                getMockGetEvent(mockGamecode),
            );

            const calls = mockDynamoClient.commandCalls(QueryCommand);
            expect(calls.length).toBe(1);
        });
    });
});

function getMockGetEvent(gamecode: string): RestEvent {
    return {
        resource: "/games/{gameId}",
        path: "/games/abc123",
        httpMethod: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIs...",
            Host: "abc123.execute-api.us-east-2.amazonaws.com",
            "User-Agent": "curl/7.68.0",
        },
        multiValueHeaders: {
            Accept: ["application/json"],
        },
        queryStringParameters: {
            gamecode: gamecode,
        },
        multiValueQueryStringParameters: {
            includePlayers: ["true"],
        },
        pathParameters: {
            gameId: "",
        },
        stageVariables: {
            stage: "",
        },
        requestContext: {
            resourceId: "abc123",
            resourcePath: "/games/{gameId}",
            httpMethod: "GET",
            path: "/prod/games/abc123",
            accountId: "123456789012",
            protocol: "HTTP/1.1",
            stage: "prod",
            domainName: "abc123.execute-api.us-east-2.amazonaws.com",
            requestId: "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
            apiId: "abc123",
            authorizer: undefined, // or null for no authorizer
            requestTimeEpoch: 1645203296000,
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: "192.168.1.1",
                userAgent: "curl/7.68.0",
                userArn: null,
                user: null,
                clientCert: null,
            },
        },
        body: null,
        isBase64Encoded: false,
    };
}
