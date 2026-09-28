// Run: node --experimental-strip-types scripts/export-campus.mjs /absolute/output.glb
// Explicit output path prevents accidentally overwriting a model edited in Blender.
import { writeFile } from "node:fs/promises"
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js"
import { createCampus } from "../lib/campus-model.ts"
if (!process.argv[2]?.endsWith(".glb")) throw new Error("Supply an output .glb path")
// GLTFExporter uses the browser FileReader API for binary blobs.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(result => { this.result = result; this.onloadend?.() }).catch(error => this.onerror?.(error))
  }
}
const { campus } = createCampus()
const binary = await new GLTFExporter().parseAsync(campus, { binary: true })
await writeFile(process.argv[2], Buffer.from(binary))
console.log(`Exported editable campus: ${process.argv[2]}`)
