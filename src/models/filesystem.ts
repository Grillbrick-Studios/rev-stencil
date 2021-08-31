import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { iSerializeData } from './common';

export async function writeFile<T>(data: iSerializeData<T>, path: string) {
  await Filesystem.writeFile({
    path,
    data: JSON.stringify(data),
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
}

export async function readFile<T>(path: string): Promise<iSerializeData<T>> {
  const content = await Filesystem.readFile({
    path,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
  console.log(JSON.parse(content.data) as iSerializeData<T>);
  return JSON.parse(content.data);
}
