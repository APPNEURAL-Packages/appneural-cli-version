import fs from "fs/promises";
import path from "path";
import { logger } from "@appneural/cli-shared";
import { withTelemetry } from "@appneural/cli-shared";
import { withSpinner } from "@appneural/cli-shared";
import { FileError } from "@appneural/cli-shared";
const PACKAGE_PATH = path.join(process.cwd(), "package.json");
async function bumpVersion(type) {
    try {
        const raw = await fs.readFile(PACKAGE_PATH, "utf-8");
        const pkg = JSON.parse(raw);
        const version = pkg.version ?? "0.0.0";
        const segments = version.split(".").map((seg) => parseInt(seg, 10) || 0);
        if (type === "patch") {
            segments[2] = (segments[2] ?? 0) + 1;
        }
        else if (type === "minor") {
            segments[1] = (segments[1] ?? 0) + 1;
            segments[2] = 0;
        }
        else {
            segments[0] = (segments[0] ?? 0) + 1;
            segments[1] = 0;
            segments[2] = 0;
        }
        const next = segments.slice(0, 3).join(".");
        pkg.version = next;
        await fs.writeFile(PACKAGE_PATH, `${JSON.stringify(pkg, null, 2)}\n`, "utf-8");
        return next;
    }
    catch (_error) {
        throw new FileError("APPNEURAL failed to bump version");
    }
}
export function registerVersionCommands(program) {
    const version = program.command("version").description("APPNEURAL version management");
    ["patch", "minor", "major"].forEach((type) => {
        version
            .command(type)
            .description(`Create an APPNEURAL ${type} release`)
            .action(() => withTelemetry(`version:${type}`, async () => {
            const next = await withSpinner("Updating APPNEURAL version", async () => bumpVersion(type));
            logger.success(`APPNEURAL version bumped to ${next}`);
        }));
    });
}
//# sourceMappingURL=version.js.map