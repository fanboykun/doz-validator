import { format, increment as inc, parse } from "@std/semver";

const versionType = Deno.args[0] as "patch" | "minor" | "major";
if (!versionType || !["patch", "minor", "major"].includes(versionType)) {
  console.error("Please specify version type: patch, minor, or major");
  Deno.exit(1);
}
const denoConfig = JSON.parse(await Deno.readTextFile("deno.json"));
const jsrConfig = JSON.parse(await Deno.readTextFile("jsr.json"));
const currentVersion = parse(denoConfig.version)
const newVersion = inc(currentVersion, versionType);
const formattedNewVersion = format(newVersion)

if (!formattedNewVersion) {
  console.error("Failed to increment version");
  Deno.exit(1);
}

// Update both config files
denoConfig.version = formattedNewVersion;
jsrConfig.version = formattedNewVersion;

// Write back to files
await Deno.writeTextFile("deno.json", JSON.stringify(denoConfig, null, 2));
await Deno.writeTextFile("jsr.json", JSON.stringify(jsrConfig, null, 2));

console.log(`Version updated from ${currentVersion} to ${formattedNewVersion}`);
