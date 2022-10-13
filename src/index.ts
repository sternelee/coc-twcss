import { commands, CompleteResult, ExtensionContext, listManager, sources, window, workspace } from 'coc.nvim';
import fs from 'fs';
import path from 'path';
import DemoList from './lists';

const twcssItems: any[] = [];

export async function activate(context: ExtensionContext): Promise<void> {
  window.showMessage(`coc-twcss works!`);

  const file = path.resolve(__dirname, 'tw.json');
  if (!fs.existsSync(file)) return;

  fs.readFile(file, 'utf8', (err, content) => {
    if (err) return;
    const lines = JSON.parse(content);
    Object.keys(lines).forEach((key: string) => {
      twcssItems.push({ description: lines[key], character: key });
    });
  });

  context.subscriptions.push(
    // commands.registerCommand('coc-twcss.Command', async () => {
    //   window.showMessage(`coc-twcss Commands works!`);
    // }),

    // listManager.registerList(new DemoList(workspace.nvim)),

    sources.createSource({
      name: 'coc-twcss', // unique id
      shouldComplete: async (opt) => {
        const { linenr, col, input, line } = opt
        const buf = Buffer.from(line, 'utf8');
        const pre = buf.slice(0, col - 1).toString('utf8');
        // let after = buf.slice(col + input.length).toString('utf8');
        return /<[^<]*?\s$/g.test(pre);
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
    items: twcssItems.map((t: any) => ({ word: t.character, info: t.description, menu: '[Twcss]', kind: '⚡︎' })),
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