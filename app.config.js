// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "speakeasy",
    slug: "speakeasy",
    version: "1.0.0",
    plugins: ["expo-router"],
    scheme: "speakeasy",
    extra: {
      FLASK_URL: "http://localhost:5001",
    },
  },
};
