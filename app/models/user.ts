import { Document, Schema, model } from 'mongoose'; 

export interface IUser extends Document {
  login: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  created: Date;
  updated: Date;
}

export const UserSchema : Schema = new Schema({
    id: {
      type: String,
      require: true
    },
    login: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    phone: {
      type: String,
      require: true
    },
    firstname: {
      type: String,
      require: true
    },
    lastname: {
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
  })
  .pre('save', function(next) {
    this.updated = new Date();
    next();
  });

export const User = model<IUser>('User', UserSchema);

