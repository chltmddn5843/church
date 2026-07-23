import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  edge: {
    override: {
      externals: ["pg-cloudflare"],
    },
  },
});
