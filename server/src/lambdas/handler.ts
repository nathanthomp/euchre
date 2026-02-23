import { APIGatewayProxyHandler } from "aws-lambda";

/**
 * 1. Parse the request
 * 2. Pull the game entitiy
 * 3. Check if requested action can be performed on the game
 * 4. If action is approved, perform action on game. Else, return error.
 * 5. If action is approved, push updated game entity.
 */
export const handler: APIGatewayProxyHandler = async (event) => {};
