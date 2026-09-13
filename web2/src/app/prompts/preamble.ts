import { site } from "@/lib/site";

// Prepended when "Copy with preamble" is used, so a prompt pasted into a
// fresh agent session also carries the steps needed to turn its output into
// an actual Physlib contribution, not just the task itself.
export const PREAMBLE = `Before starting, set yourself up to contribute to Physlib:
1. Clone the repository: git clone ${site.github}
2. Read the README and the Getting Started guide (${site.url}/getting-started) for how to install Lean, build the project, and the naming/docstring/style conventions we expect.
3. Create a new branch off the latest \`master\` for this change.
4. Confirm \`lake build\` succeeds before you start.
5. Once done, confirm \`lake build\` still succeeds, commit your work, and open a pull request against ${site.github} describing what you did and why.

With that in mind:

`;
