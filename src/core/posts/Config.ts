
import Store from 'configstore';

declare interface IConfig {
  expeer: string;
  darktheme: boolean;
}

const deft: IConfig = {
  expeer: '',
  darktheme: false,
};

const store = new Store('proline-settings', deft);

const callbacks: ((c: IConfig) => void)[] = [];

export const getConfig = (): IConfig => {
  return store.all;
};

export const handleUpdate = (fn: (c: IConfig) => void) => {
  callbacks.push(fn);
};

const emitChange = () => {
  callbacks.forEach((fn) => fn(store.all as IConfig));
};

export const changeTheme = (dark: boolean) => {
  store.set('darktheme', dark);
  emitChange();
};

export const updatePeers = (expeer: string) => {
  store.set('expeer', expeer);
  emitChange();
};
