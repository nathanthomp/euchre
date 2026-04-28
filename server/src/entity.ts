import {
    AttributeValue,
    DynamoDBClient,
    PutItemCommand,
    QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export abstract class Entity {
    /**
     * Methods
     * - public abstract static create();
     * - public abstract static load();
     * - public abstract save();
     *
     * - public toItem();
     * - public static fromItem();
     */
    public abstract toItem(): Record<string, AttributeValue>;
}

export class EntityManager {
    constructor(private readonly client: DynamoDBClient) {}

    public async query(pk: string): Promise<Record<string, AttributeValue>> {
        const query = await this.client.send(
            new QueryCommand({
                TableName: "EuchreTable",
                KeyConditionExpression: "pk = :pk",
                ExpressionAttributeValues: marshall({ ":pk": pk }),
            }),
        );

        if (!query.Items) {
            throw new Error("Query failed");
        }

        return query.Items[0];
    }

    public async put(entity: Entity) {
        await this.client.send(
            new PutItemCommand({
                TableName: "EuchreTable",
                Item: entity.toItem(),
            }),
        );
    }
}
