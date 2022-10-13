import { commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace } from 'coc.nvim';
import { twcssItems } from './tw';
// import fs from 'fs';
// import path from 'path';
// import DemoList from './lists';

// const twcssItems: any[] = [];

const items = Object.keys(twcssItems).map((k) => ({ word: k, info: twcssItems[k], kind: 'TW' }));

export async function activate(context: ExtensionContext): Promise<void> {
  window.showMessage(`coc-twcss works!`);

  // const file = path.resolve(__dirname, 'tw.json');
  // if (!fs.existsSync(file)) return;

  // fs.readFile(file, 'utf8', (err, content) => {
  //   if (err) return;
  //   const lines = JSON.parse(content);
  //   Object.keys(lines).forEach((key: string) => {
  //     twcssItems.push({ description: lines[key], character: key });
  //   });
  // });

  context.subscriptions.push(
    // commands.registerCommand('coc-twcss.Command', async () => {
    //   window.showMessage(`coc-twcss Commands works!`);
    // }),

    // listManager.registerList(new DemoList(workspace.nvim)),

    sources.createSource({
      name: 'coc-twcss', // unique id
      triggerCharacters: [],
      shouldComplete: async (opt) => {
        const { linenr, col, input, line } = opt
        const buf = Buffer.from(line, 'utf8');
        const pre = buf.slice(0, col - 1).toString('utf8');
        // let after = buf.slice(col + input.length).toString('utf8');
        // TODO: 只支持windicss这种class内的填写
        // const hasItems = /<[^<]*?class="[^"]*?\s$/g.test(pre);
        // TODO：同时支持twind
        // const hasItems = /<[^<]*?class="[^"]*?\s$/g.test(pre) || /tw\`/gi.test(pre);
        // 支持在unocss下的通用
        const hasItems = /<[^<]*?\s$/g.test(pre);
        window.showMessage('coc-twcc: ' + pre + ' -> ' + hasItems);
        return hasItems;
      },
      doComplete: async () => {
        const items = await getCompletionItems();
        return items;
      },
    }),

    // workspace.registerKeymap(
    //   ['n'],
    //   'twcss-keymap',
    //   async () => {
    //     window.showMessage(`registerKeymap`);
    //   },
    //   { sync: false }
    // ),

    // workspace.registerAutocmd({
    //   event: 'InsertLeave',
    //   request: true,
    //   callback: () => {
    //     window.showMessage(`registerAutocmd on InsertLeave`);
    //   },
    // })
  );
}

async function getCompletionItems(): Promise<CompleteResult> {
  return {
    priority: 1024,
    items,
    // items: [
    //   {
    //     word: 'TestCompletionItem 1',
    //     menu: '[coc-twcss]',
    //   },
    //   {
    //     word: 'TestCompletionItem 2',
    //     menu: '[coc-twcss]',
    //   },
    // ],
  };
}
