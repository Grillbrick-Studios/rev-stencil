import { Storage } from '@capacitor/storage';
import { iData } from './interfaces';

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
  private _selectedTitle?: string;

  public static async save() {
    const data: iAppendicesJson = {
      REV_Appendices: Appendices.data,
      updated: Appendices.updated,
    };

    await Storage.set({
      key: 'Appendices',
      value: JSON.stringify(data),
    });
  }

  public static async load(): Promise<boolean> {
    try {
      const { value } = await Storage.get({ key: 'Appendices' });
      const appendixData: iAppendicesJson = JSON.parse(value);
      Appendices._data = appendixData.REV_Appendices;
      Appendices.updated = new Date(appendixData.updated);
      return true;
    } catch (e) {
      return false;
    }
  }

  public set selectedTitle(target: string | undefined) {
    if (target === undefined || this.getTitles().indexOf(target) >= 0) {
      this._selectedTitle = target;
    }
  }

  public get selectedTitle(): string | undefined {
    return this._selectedTitle;
  }

  public get path(): string {
    if (this.selectedTitle) return this.selectedTitle;
    return 'Appendices';
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

  ls(): string[] {
    if (this.selectedTitle) {
      const appendix = Appendices.data.find(a => a.title === this.selectedTitle);
      if (appendix) return [appendix.appendix];
    }
    return this.getTitles();
  }

  up(): boolean {
    if (this.selectedTitle) {
      this.selectedTitle = undefined;
      return true;
    }
    return false;
  }

  select(target: string): void {
    this.selectedTitle = target;
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
    if (Appendices.data) return new Appendices(Appendices.data);
    if (await Appendices.load()) return new Appendices(Appendices._data);
    await Appendices.fetch();
    return new Appendices(Appendices.data);
  }

  getTitles(): string[] {
    return Appendices._data.map(a => a.title);
  }

  getAppendix(title: string): string {
    return Appendices._data.filter(a => a.title === title)[0].appendix;
  }
}
