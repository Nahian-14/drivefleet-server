require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const cars = [
  {
    carName: "Mercedes-Benz GLE 450",
    carType: "SUV",
    dailyRentPrice: 120,
    seatCapacity: 5,
    pickupLocation: "New York, NY",
    imageURL: "https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80",
    description: "Experience luxury redefined with the Mercedes-Benz GLE 450. Featuring a turbocharged engine, premium leather interior, and cutting-edge driver assistance systems. Perfect for both city drives and long road trips.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 28,
    createdAt: new Date(),
  },
  {
    carName: "BMW X5 xDrive40i",
    carType: "SUV",
    dailyRentPrice: 110,
    seatCapacity: 5,
    pickupLocation: "Los Angeles, CA",
    imageURL: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    description: "The BMW X5 combines sporty performance with everyday practicality. Enjoy a powerful inline-6 engine, panoramic sunroof, and BMW's legendary driving dynamics on any road.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 35,
    createdAt: new Date(),
  },
  {
    carName: "Tesla Model S Plaid",
    carType: "Electric",
    dailyRentPrice: 150,
    seatCapacity: 5,
    pickupLocation: "San Francisco, CA",
    imageURL: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
    description: "The fastest production car ever made. The Tesla Model S Plaid delivers 1,020 horsepower and 0-60 mph in under 2 seconds. Features autopilot, 17-inch touchscreen, and over 390 miles of range.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 42,
    createdAt: new Date(),
  },
  {
    carName: "Toyota Camry XSE",
    carType: "Sedan",
    dailyRentPrice: 55,
    seatCapacity: 5,
    pickupLocation: "Chicago, IL",
    imageURL: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80",
    description: "The Toyota Camry XSE is the perfect blend of style and reliability. With a sporty V6 engine, 8-inch touchscreen, and Toyota Safety Sense, it's the ideal car for any occasion.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 19,
    createdAt: new Date(),
  },
  {
    carName: "Porsche Cayenne Turbo",
    carType: "Luxury",
    dailyRentPrice: 180,
    seatCapacity: 5,
    pickupLocation: "Miami, FL",
    imageURL: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
    description: "Pure Porsche performance in an SUV body. The Cayenne Turbo packs a twin-turbocharged V8 producing 541 horsepower. Adaptive air suspension ensures a smooth ride whether on track or highway.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 15,
    createdAt: new Date(),
  },
  {
    carName: "Range Rover Sport HSE",
    carType: "SUV",
    dailyRentPrice: 140,
    seatCapacity: 5,
    pickupLocation: "Houston, TX",
    imageURL: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    description: "The Range Rover Sport HSE is the pinnacle of British luxury SUVs. Featuring Terrain Response 2, a 355hp supercharged engine, and a stunning interior crafted with the finest materials.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 22,
    createdAt: new Date(),
  },
  {
    carName: "Honda Civic Sport",
    carType: "Hatchback",
    dailyRentPrice: 45,
    seatCapacity: 5,
    pickupLocation: "Seattle, WA",
    imageURL: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80",
    description: "Fun, fuel-efficient, and feature-packed. The Honda Civic Sport hatchback is great for city driving with its turbocharged engine, 9-inch Honda Sensing display, and sporty styling.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 31,
    createdAt: new Date(),
  },
  {
    carName: "Audi A8 L",
    carType: "Luxury",
    dailyRentPrice: 160,
    seatCapacity: 5,
    pickupLocation: "Boston, MA",
    imageURL: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
    description: "The Audi A8 L is the ultimate executive sedan. With a mild-hybrid V8, massaging rear seats, night vision assist, and Audi's signature Quattro all-wheel drive, every journey is first class.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 18,
    createdAt: new Date(),
  },
  {
    carName: "Ford Mustang GT",
    carType: "Sedan",
    dailyRentPrice: 85,
    seatCapacity: 4,
    pickupLocation: "Dallas, TX",
    imageURL: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    description: "The iconic American muscle car. The Ford Mustang GT features a 5.0L V8 Coyote engine with 450 horsepower, Brembo brakes, and a magnetic ride control suspension for thrilling performance.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 27,
    createdAt: new Date(),
  },
  {
    carName: "Toyota Sienna XSE",
    carType: "Minivan",
    dailyRentPrice: 75,
    seatCapacity: 8,
    pickupLocation: "Phoenix, AZ",
    imageURL: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
    description: "The perfect family hauler. The Toyota Sienna XSE hybrid offers AWD, 36 MPG combined, captain's chairs, a 9-inch entertainment system, and Toyota Safety Sense for the whole family's peace of mind.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 12,
    createdAt: new Date(),
  },
  {
    carName: "Lamborghini Urus",
    carType: "Luxury",
    dailyRentPrice: 350,
    seatCapacity: 5,
    pickupLocation: "Las Vegas, NV",
    imageURL: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
    description: "The world's most powerful Super SUV. The Lamborghini Urus delivers 641 horsepower from its twin-turbo V8, launches to 60 mph in 3.5 seconds, and turns heads wherever it goes.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 9,
    createdAt: new Date(),
  },
  {
    carName: "Hyundai Tucson N-Line",
    carType: "SUV",
    dailyRentPrice: 60,
    seatCapacity: 5,
    pickupLocation: "Atlanta, GA",
    imageURL: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&q=80",
    description: "The Hyundai Tucson N-Line offers sporty styling and practical everyday performance. Features a turbocharged engine, 10.25-inch navigation screen, and Hyundai SmartSense safety suite.",
    availability: true,
    ownerEmail: "admin@drivefleet.com",
    booking_count: 16,
    createdAt: new Date(),
  },
];

async function seedDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
      version: '1',
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('drivefleetDB');
    const carsCollection = db.collection('cars');

    // Clear existing cars first
    await carsCollection.deleteMany({});
    console.log('🗑️  Cleared existing cars');

    // Insert all cars
    const result = await carsCollection.insertMany(cars);
    console.log(`🚗 Inserted ${result.insertedCount} cars successfully!`);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
