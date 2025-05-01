import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "TaskDulo",
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('MongoDB Connected to database:', mongoose.connection.db.databaseName);
    // console.log('Collections:', await mongoose.connection.db.listCollections().toArray());
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});
export default connectDB;