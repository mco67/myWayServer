import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  login: string;
  password: string;
  email: string;
  phone: string;
  firstname: string;
  lastname: string;
  created: Date;
  updated: Date;
  
  verifyPassword(password :string, handler: any);
}

export const UserSchema: Schema = new Schema({
  login: {
    type: String,
    require: true,
    index: { unique: true }
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
  rights:{
    type: [String],
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

UserSchema.plugin(require('mongoose-bcrypt'));

/*UserSchema.pre('save', (next) => {
  // Update last modification date
  this.updated = new Date();
  next();
});*/


export const User = model<IUser>('User', UserSchema);
export const USER_ROLE = "user";
export const USER_ADMIN = "admin";
export const USER_SUPERADMIN = "superadmin";
