import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { iSerializeData } from './common';

export async function writeFile<T>(data: iSerializeData<T>, path: string): Promise<() => Promise<iSerializeData<T>>> {
  await Filesystem.writeFile({
    path,
    data: JSON.stringify(data),
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  return async () => readFile(path);
}

export async function readFile<T>(path: string): Promise<iSerializeData<T>> {
  const content = await Filesystem.readFile({
    path,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });

  return JSON.parse(content.data);
}
