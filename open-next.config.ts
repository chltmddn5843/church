import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  functions: {
    default: {
      override: {
        externals: ["pg-cloudflare"],
      },
    },
  },
});
