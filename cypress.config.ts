import { defineConfig } from "cypress";

export default defineConfig({
  env: {
    name: "Jennis",
    email: "jennis@gmail.com",
    password: "123"
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {}
  }
});
