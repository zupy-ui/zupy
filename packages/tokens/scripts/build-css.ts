import { toCss, toTailwindTheme } from "@/css";

await Bun.write("dist/tokens.css", `${toCss()}\n`);
await Bun.write("dist/theme.css", toTailwindTheme());
