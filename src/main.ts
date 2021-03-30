import * as core from "@actions/core";
import * as fs from "fs";
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
        return await fs.promises.readFile(file, "utf-8");
      })
    );
    await fs.promises.writeFile(outputFile, fileContents.join("\n"));
    core.setOutput("file", outputFile);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
