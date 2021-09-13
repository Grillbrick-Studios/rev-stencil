import { iData, Asynclock, iSerializeData, DaysSince } from './common';
import { writeFile, readFile } from './filesystem';

const URL = 'https://www.revisedenglishversion.com/jsonrevexport.php?permission=yUp&autorun=1&what=appendices';

export interface iAppendices {
  title: string;
  appendix: string;
}

export interface iAppendicesJson {
  REV_Appendices: iAppendices[];
  updated?: Date;
}

export class Appendices implements iData<iAppendices> {
  private static _data: iAppendices[];
  private static updated: Date;
  private static lock = new Asynclock();

  public static async save() {
    const data: iSerializeData<iAppendices> = {
      data: Appendices.data,
      updated: Appendices.updated,
    };

    await writeFile(data, 'Appendices');
  }

  public static async load(): Promise<boolean> {
    try {
      const appendixData: iSerializeData<iAppendices> = await readFile('Appendices');
      Appendices._data = appendixData.data;
      Appendices.updated = new Date(appendixData.updated);
      if (DaysSince(Appendices.updated) > 7) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  public static set data(d: iAppendices[]) {
    Appendices._data = d;
  }

  public static get data(): iAppendices[] {
    return Appendices._data;
  }

  public get data(): iAppendices[] {
    return Appendices._data;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(data: iAppendices[]) {
    Appendices.data = data;
  }

  private static async fetch() {
    console.log('Fetching appendices from the web. please wait...');
    const res = await fetch(URL);
    console.log('appendices downloaded!');
    const commentary = await res.json();
    Appendices._data = commentary.REV_Appendices;
    Appendices.updated = new Date();
    Appendices.save();
  }

  static async onReady(): Promise<Appendices> {
    await this.lock.promise;
    this.lock.enable();
    try {
      if (Appendices.data) return new Appendices(Appendices.data);
      else if (await Appendices.load()) return new Appendices(Appendices._data);
      else await Appendices.fetch();
    } catch (e) {
      console.error(e);
    } finally {
      this.lock.disable();
    }
    return new Appendices(Appendices.data);
  }

  getTitles(): string[] {
    return Appendices._data.map(a => a.title);
  }

  getAppendix(title: string): string {
    return Appendices._data.filter(a => a.title === title)[0].appendix;
  }

  next(title: string): string {
    const titles = this.getTitles();
    const index = titles.indexOf(title);
    if (index === -1) return title;
    if (titles.length > index + 1) return titles[index + 1];
    return title;
  }

  prev(title: string): string {
    const titles = this.getTitles();
    const index = titles.indexOf(title);
    if (index === -1) return title;
    if (index > 0) return titles[index - 1];
    return title;
  }
}
