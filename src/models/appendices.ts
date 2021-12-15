export const APPENDICES_URL = 'https://www.revisedenglishversion.com/jsondload.php?fil=203';

export interface iAppendices {
  title: string;
  appendix: string;
}

export interface iAppendicesJson {
  REV_Appendices: iAppendices[];
  updated?: Date;
}

export class Appendices {
  private _data: iAppendices[];

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(data: iAppendices[]) {
    this._data = data;
  }

  get data(): iAppendices[] {
    return this._data;
  }

  getTitles(): string[] {
    return this._data.map(a => a.title);
  }

  getAppendix(title: string): string {
    return this._data.filter(a => a.title === title)[0].appendix;
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
