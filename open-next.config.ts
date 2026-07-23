import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
  edgeExternals: ["pg-cloudflare"],
});
