import { Document, Schema, model } from 'mongoose';

export interface IProvider extends Document {
  dbId: string;
  name: string;
  description: string;
  created: Date;
  updated: Date;  
}

export const ProviderSchema: Schema = new Schema({
  id: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true,
    index: { unique: true }
  },
  description: {
    type: String,
    require: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

export const Provider = model<IProvider>('Provider', ProviderSchema);

