import { commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace } from 'coc.nvim';
// import fg from 'fast-glob';
import { twcssItems } from './tw';
// import fs from 'fs';
// import path from 'path';

const items = Object.keys(twcssItems).map((k) => ({ word: k, info: `.${k} {\n  ${twcssItems[k]}\n}`, kind: 'TW' }));

let isTwind = false;
let isUnoCSS = false;

export async function activate(context: ExtensionContext): Promise<void> {
  const isEnabled = workspace.getConfiguration('coc-twcss').get<boolean>('enable', false);
  isTwind = workspace.getConfiguration('coc-twcss').get<boolean>('twind', false);
  isUnoCSS = workspace.getConfiguration('coc-twcss').get<boolean>('unocss', false);
  if (!isEnabled) return;
  window.showMessage(`coc-twcss works!`);

  context.subscriptions.push(
    sources.createSource({
      name: 'coc-twcss', // unique id
      triggerCharacters: [],
      shouldComplete: async (opt) => {
        const { col, line } = opt;
        const buf = Buffer.from(line, 'utf8');
        const pre = buf.slice(0, col).toString('utf8');
        let hasItems = /<[^<]*?class="[^"]*?\s$/g.test(pre);
        if (isTwind) {
          hasItems = hasItems || /tw\`/gi.test(pre);
        }
        if (isUnoCSS) {
          hasItems = hasItems || /<[^<]*?[\s|"]$/g.test(pre);
        }
        return hasItems;
      },
      doComplete: async () => {
        const completeResult = await getCompletionItems();
        // if (isTwind) {
        //   completeResult = {
        //     ...completeResult,
        //     items: completeResult.items.map((v) => ({ ...v, info: `Twind\n${v.info}` })),
        //   };
        // }
        // if (isUnoCSS) {
        //   completeResult = {
        //     ...completeResult,
        //     items: completeResult.items.map((v) => ({ ...v, info: `UnoCSS\n${v.info}` })),
        //   };
        // }
        return completeResult;
      },
    })
  );
}

async function getCompletionItems(): Promise<CompleteResult> {
  return {
    priority: 1024,
    items,
  };
}
