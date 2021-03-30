import * as core from "@actions/core";
import { readFile, writeFile } from "fs/promises";
import { glob } from "glob";
import { promisify } from "util";

async function run(): Promise<void> {
  const inputGlob = core.getInput("input-glob", { required: true });
  const outputFile = core.getInput("output-file", { required: true });
  const asyncGlob = promisify(glob);

  try {
    const filesToJoin = await asyncGlob(inputGlob);
    const fileContents = await Promise.all(
      filesToJoin.map(async (file) => {
        return await readFile(file, "utf-8");
      })
    );
    await writeFile(outputFile, fileContents.join("\n"));
    core.setOutput("file", outputFile);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
