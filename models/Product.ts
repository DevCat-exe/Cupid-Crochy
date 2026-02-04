import mongoose, { Schema, Document } from "mongoose";

export interface IReview {
  user: string;
  userImage?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviews: IReview[];
  tags: string[];
  isNewProduct: boolean;
  isSoldOut: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  user: { type: String, required: true },
  userImage: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: { type: [ReviewSchema], default: [] },
    tags: { type: [String], default: [] },
    isNewProduct: { type: Boolean, default: false },
    isSoldOut: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
