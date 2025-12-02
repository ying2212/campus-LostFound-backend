import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    db:{
      url: env("DIRECT_URL")
    }
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL")
  },
});
