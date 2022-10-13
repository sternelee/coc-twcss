"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  activate: () => activate
});
module.exports = __toCommonJS(src_exports);
var import_coc = require("coc.nvim");
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var twcssItems = [];
async function activate(context) {
  import_coc.window.showMessage(`coc-twcss works!`);
  const file = import_path.default.resolve(__dirname, "tw.json");
  if (!import_fs.default.existsSync(file))
    return;
  import_fs.default.readFile(file, "utf8", (err, content) => {
    if (err)
      return;
    const lines = JSON.parse(content);
    Object.keys(lines).forEach((key) => {
      twcssItems.push({ description: lines[key], character: key });
    });
  });
  context.subscriptions.push(
    import_coc.sources.createSource({
      name: "coc-twcss",
      shouldComplete: async (opt) => {
        const { linenr, col, input, line } = opt;
        const buf = Buffer.from(line, "utf8");
        const pre = buf.slice(0, col - 1).toString("utf8");
        const hasItems = /<[^<]*?\s$/g.test(pre);
        import_coc.window.showMessage(`code: ${pre} is: ${hasItems}`);
        return hasItems;
      },
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      }
    })
  );
}
async function getCompletionItems() {
  return {
    items: twcssItems.map((t) => ({ word: t.character, info: t.description, menu: "[coc-twcss]", kind: "TW" }))
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate
});
