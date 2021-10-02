import { AccountDocument } from '../../interfaces';
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { timestamps: true });

export const Account = mongoose.model<AccountDocument>("Account", AccountSchema);