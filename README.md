# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Managing the Database 

1. Resetting the Database

```
bash manage_bd.sh
```

Choose Option: `3) Reset database with basic test data`

OR RUN directly:
```
docker exec speakeasy_db psql -U speakeasy -d speakeasy_dev -f /docker-entrypoint-initdb.d/init.sql
```

This uses `init.sql` to rebuild the schema and load predefined sample data.

2. Seeding with Faker-generated Realistic Data
Start the Epress Server:
```
node db_api_server.js
```
Then run in another terminal window:
```
curl -X POST http://localhost:3000/api/seed
```
This should populate the Database with:

 . 20 users

 . 10 bundles

 . 30 bookings

 To Customize:
 ```
 curl -X POST http://localhost:3000/api/seed \
  -H "Content-Type: application/json" \
  -d '{"userCount":10,"bundleCount":5}'
```

3. Creating a Test user
```
curl -X POST http://localhost:3000/api/seed/test-user \
  -H "Content-Type: application/json" \
  -d '{"email": "dev@example.com", "password": "password123"}'
```

## Queryiong the Database 
1. PostgresSQL CLI
Access psql shell:
```
docker exec -it speakeasy_db psql -U speakeasy -d speakeasy_dev 
```

Then Run:
```
SELECT * FROM users;
SELECT * FROM bundles;
\q
```

## Editing Schema 
1. Modity `init.sql`

2. Reset DB:
```
bash manage_db.sh -> Option 3
```
The Test Schnages:
```
curl -X POST http://localhost:3000/api/status
```

## ✅ Useful Tips

. After schema chamge, reset DB to appply them

. Use `/api/seed` to test with realistic data

. Use `/api/seed/test-user` to create specific logins

. Monitor Logs via:

```
docker logs speakeasy_db
```
. Use tolls like pgAdmin, DBeaver, or TablePlus to browse data visually

