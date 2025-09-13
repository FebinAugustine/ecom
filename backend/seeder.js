import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import { Product } from "./models/product.model.js";
import { Category } from "./models/category.model.js";
import { Order } from "./models/order.model.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for Seeder");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    // 1. Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    // 2. Read the simplified, valid JSON file
    const seederData = JSON.parse(fs.readFileSync("./seeder.json", "utf-8"));

    // 3. Insert the data directly. Mongoose will handle string-to-ObjectId casting.
    await Category.insertMany(seederData.categories);
    await User.insertMany(seederData.users);
    await Product.insertMany(seederData.products);
    await Order.insertMany(seederData.orders);

    console.log("Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error with data import:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error with data destruction:", error);
    process.exit(1);
  }
};

const runSeeder = async () => {
  await connectDB();

  if (process.argv[2] === "-d") {
    await destroyData();
  } else {
    await importData();
  }
};

runSeeder();
