import { getTsProgram, typeParserPlugin } from "./dist/index.js";

export default {
  /** Globs to analyze */
  globs: ["demo/src/**/*.ts"],
  /** Directory to output CEM to */
  outdir: "demo", // ensure output goes to demo/custom-elements.json by default
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Output CEM path to `package.json`, defaults to true */
  packagejson: false,
  plugins: [typeParserPlugin({ debug: false })], // restore default: parseObjectTypes: 'none'
  overrideModuleCreation({ ts, globs }) {
    const program = getTsProgram(ts, globs, "tsconfig.json");
    return program
      .getSourceFiles()
      .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
  // Helper to update parseObjectTypes in the plugin config
  updateParseObjectTypes(value) {
    return {
      globs: ["demo/src/**/*.ts"],
      outdir: "demo",
      dev: false,
      packagejson: false,
      plugins: [typeParserPlugin({ debug: false, parseObjectTypes: value })],
      overrideModuleCreation({ ts, globs }) {
        const program = getTsProgram(ts, globs, "tsconfig.json");
        return program
          .getSourceFiles()
          .filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
      },
    };
  },
};
