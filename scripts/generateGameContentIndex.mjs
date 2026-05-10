import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentDir = path.join(root, "content", "games");
const outFile = path.join(contentDir, "index.ts");

const jsonFiles = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b));

function varNameFromFile(fileName) {
  const base = fileName.replace(/\.json$/, "");
  const safe = base.replace(/[^a-zA-Z0-9_]/g, "_");
  return safe.match(/^[a-zA-Z_]/) ? safe : `_${safe}`;
}

const imports = jsonFiles
  .map((file) => {
    const varName = varNameFromFile(file);
    return `import ${varName} from "@/content/games/${file}";`;
  })
  .join("\n");

const mapping = jsonFiles
  .map((file) => {
    const slug = file.replace(/\.json$/, "");
    const varName = varNameFromFile(file);
    return `  ${slug}: ${varName} as unknown as GameContentV1,`;
  })
  .join("\n");

const content = `${imports}\n\nimport type { GameContentV1 } from "@/lib/gameContentV1";\n\nexport const gameContentV1 = {\n${mapping}\n};\n`;

const prev = fs.existsSync(outFile) ? fs.readFileSync(outFile, "utf8") : "";
if (prev !== content) {
  fs.writeFileSync(outFile, content, "utf8");
}

