import { increment as inc } from "@std/semver";

// Read version type from command line args (patch, minor, or major)
const versionType = Deno.args[0] as "patch" | "minor" | "major";
if (!versionType || !["patch", "minor", "major"].includes(versionType)) {
  console.error("Please specify version type: patch, minor, or major");
  Deno.exit(1);
}

// Read current version from deno.json and jsr.json
const denoConfig = JSON.parse(await Deno.readTextFile("deno.json"));
const jsrConfig = JSON.parse(await Deno.readTextFile("jsr.json"));

// Calculate new version
const currentVersion = denoConfig.version;
const newVersion = inc(currentVersion, versionType);

if (!newVersion) {
  console.error("Failed to increment version");
  Deno.exit(1);
}

// Update both config files
denoConfig.version = newVersion;
jsrConfig.version = newVersion;

// Write back to files
await Deno.writeTextFile("deno.json", JSON.stringify(denoConfig, null, 2));
await Deno.writeTextFile("jsr.json", JSON.stringify(jsrConfig, null, 2));

console.log(`Version updated from ${currentVersion} to ${newVersion}`);
