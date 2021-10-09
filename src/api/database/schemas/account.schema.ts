import { Connection, Query, Schema } from 'mongoose';
import { AccountDocument } from '../../interfaces/account';

export default function buildSchema(connection: Connection): Schema {
    const AccountSchema = new Schema(
        {
            name: { type: String, required: true }
        },
        { timestamps: true }
    );

    // register middleware on the schema
    AccountSchema.pre<Query<AccountDocument, AccountDocument>>('deleteOne', async function () {
        const account = await this.model.findOne(this.getFilter());

        // remove all associated post and comment documents
        await connection.model('Post').deleteMany({ creator: account._id });
        await connection.model('Comment').deleteMany({ creator: account._id });
    });

    return AccountSchema;
}