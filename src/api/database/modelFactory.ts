import { Connection, Model, Schema } from 'mongoose';

export default function getModel<T>(
    connection: Connection,
    modelName: string,
    modelSchema: Schema,
): Model<T> {
    return connection.model<T>(modelName, modelSchema);
}