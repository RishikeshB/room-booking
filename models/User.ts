import bcrypt from "bcryptjs";
import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ createdAt: -1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
  comparePassword(password: string): Promise<boolean>;
};

type UserModel = Model<UserDocument>;

export const User =
  (models.User as UserModel | undefined) ||
  model<UserDocument, UserModel>("User", userSchema);

