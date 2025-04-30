// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "speakeasy",
    slug: "speakeasy",
    version: "1.0.0",
    extra: {
      FLASK_URL: process.env.FLASK_URL || "http://10.54.11.198:5001",
    },
  },
};
