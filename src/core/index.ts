
import * as Channels from './posts/Channels';
import * as Config from './posts/Config';
import * as Posts from './posts/Posts';
import * as Files from './posts/Files';
import * as Peers from './peers/Peers';
import './p2p/server';

import omelet from './omelet';
omelet('[240e:390:5e61:410::2333]:21121');

export default {
  Channels,
  Config,
  Posts,
  Files,
  Peers,
};
