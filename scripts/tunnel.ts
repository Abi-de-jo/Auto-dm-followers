import ngrok from "@ngrok/ngrok";
import fs from "fs";
import path from "path";

// Load environment variables
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        const val = rest.join("=").replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const PORT = Number(process.env.PORT) || 3000;
const authtoken = process.env.NGROK_AUTHTOKEN;

async function run() {
  try {
    console.log(`Starting ngrok tunnel for local port ${PORT}...`);
    const listener = await ngrok.forward({
      addr: PORT,
      authtoken: authtoken || undefined,
    });

    const url = listener.url();

    console.log("\n=======================================================");
    console.log("🚀 NGROK HTTPS TUNNEL ACTIVE");
    console.log("=======================================================");
    console.log(`Public App URL : ${url}`);
    console.log(`Webhook URL    : ${url}/api/webhooks/instagram`);
    console.log(`OAuth Callback : ${url}/api/instagram/callback`);
    console.log(`Data Deletion  : ${url}/api/webhooks/meta-compliance/data-deletion`);
    console.log(`Deauthorize    : ${url}/api/webhooks/meta-compliance/deauthorize`);
    console.log("=======================================================\n");
    // Keep Node process alive indefinitely
    setInterval(() => {}, 60_000);
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath) && url) {
      let content = fs.readFileSync(envPath, "utf8");
      if (content.includes("NEXT_PUBLIC_APP_URL=")) {
        content = content.replace(/NEXT_PUBLIC_APP_URL=.*/, `NEXT_PUBLIC_APP_URL="${url}"`);
      } else {
        content += `\nNEXT_PUBLIC_APP_URL="${url}"\n`;
      }
      if (content.includes("NEXTAUTH_URL=")) {
        content = content.replace(/NEXTAUTH_URL=.*/, `NEXTAUTH_URL="${url}"`);
      } else {
        content += `\nNEXTAUTH_URL="${url}"\n`;
      }
      fs.writeFileSync(envPath, content);
      console.log(`Updated NEXT_PUBLIC_APP_URL in .env to ${url}`);
    }

    // Keep process alive
    const { promise } = Promise.withResolvers<void>();
    await promise;
  } catch (err: unknown) {
    console.error("❌ Failed to start ngrok tunnel:", err instanceof Error ? err.message : err);
    if (!authtoken) {
      console.log("Tip: Set NGROK_AUTHTOKEN in your .env file.");
    }
    process.exit(1);
  }
}

run();
