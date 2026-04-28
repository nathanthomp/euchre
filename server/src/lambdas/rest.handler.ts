import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Game } from "../game";
import { EntityManager } from "../entity";

export type RestEvent = APIGatewayProxyEvent;

export type RestResult = APIGatewayProxyResult;

export class RestHandler {
    constructor(private readonly entityManager: EntityManager) {}

    public async handle(event: RestEvent): Promise<RestResult> {
        console.log(`Rest Event: ${JSON.stringify(event)}`);
        try {
            switch (event.httpMethod) {
                case "GET":
                    return await this.handleGet(event);
                case "POST":
                    return await this.handlePost(event);
                default:
                    throw new Error(
                        `Unsupported http method ${event.httpMethod}`,
                    );
            }
        } catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Error" }),
            };
        }
    }

    public async handleGet(event: RestEvent): Promise<RestResult> {
        try {
            const gamecode = event.queryStringParameters?.gamecode;
            if (!gamecode) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        error: "Missing 'gamecode' query parameter",
                    }),
                };
            }

            try {
                const game = await Game.load(gamecode);
                return {
                    statusCode: 200,
                    body: JSON.stringify(game),
                };
            } catch (error) {
                console.error(error);
                return {
                    statusCode: 404,
                    body: JSON.stringify({
                        message: `Could not load game with code ${gamecode}`,
                    }),
                };
            }
        } catch (error) {
            throw new Error(`Could not handle get request. ${error}`);
        }
    }

    public async handlePost(event: RestEvent): Promise<RestResult> {
        try {
            const game = Game.create();
            try {
                await game.save();
                return {
                    statusCode: 200,
                    body: JSON.stringify(game),
                };
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: `Could not save game with code ${game.code}`,
                    }),
                };
            }
        } catch (error) {
            throw new Error(`Could not handle post request. ${error}`);
        }
    }
}

const dynamoClient = new DynamoDBClient({ region: "us-east-2" });
const entityManager = new EntityManager(dynamoClient);

export const handler = async (event: RestEvent): Promise<RestResult> => {
    return await new RestHandler(entityManager).handle(event);
};
