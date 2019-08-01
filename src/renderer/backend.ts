import { remote } from 'electron';
import { IMain } from '../types';

const core = remote.require('./core.js');

export const main: IMain = core.default;
