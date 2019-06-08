const files = Object.create(null);
const registerfile = (file) => {
  files[file.cid + file.fid] = file;
}
const getfile = (cid, fid) => {
  return files[cid + fid];
}

registerfile({
  title: '下载到一半.zip',
  size: 155800020,
  cid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
  fid: 'b2ee3095802e53f965e9848142f1fe92',
  downloaded: 25800020,
  started: true
});
registerfile({
  title: '下载完了.zip',
  size: 198484615,
  cid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
  fid: '95802e53f965e984814b2ee302f1fe92',
  downloaded: 198484615,
  started: true
});
registerfile({
  title: '刚开始下载.zip',
  size: 2154679848,
  cid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
  fid: '814b2ee309580965e9842e53f2f1fe92',
  downloaded: 0,
  started: true
});
registerfile({
  title: '还没下载.zip',
  size: 5541679848,
  cid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
  fid: '4b2ee309580965e9842e53f2f181fe92',
  downloaded: 0,
  started: false
});

const channels = [{
  title: '测试频道',
  cid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
  posts: [{
    title: '还没阅读',
    pubtime: 1558228415020,
    content: '我永远喜欢艾拉',
    files: [
      'b2ee3095802e53f965e9848142f1fe92',
      '95802e53f965e984814b2ee302f1fe92',
      '814b2ee309580965e9842e53f2f1fe92',
      '4b2ee309580965e9842e53f2f181fe92'
    ],
    read: false
  }, {
    title: '已经阅读',
    pubtime: 1548227405020,
    content: '我永远喜欢艾米莉亚',
    files: [ ],
    read: true
  }, {
    title: '又一篇已经阅读',
    pubtime: 848227405020,
    content: '我永远喜欢怀特·天真·加百利',
    files: [ ],
    read: true
  }]
}, {
  title: '没有帖子的频道',
  cid: '095802e53f965e984814b2ee32f1fe92',
  posts: [ ]
}];

export const getChannelList = () => {
  return channels.map((chan) => {
    return {
      title: chan.title,
      cid: chan.cid,
      newpost: chan.posts.filter((p) => !p.read).length
    }
  });
}

export const getChannelInfo = (cid) => {
  return channels.filter((c) => c.cid === cid)[0];
}

export const getPostList = (cid) => {
  return channels.filter((c) => c.cid === cid)[0].posts;
}

export const getPostInfo = (cid, pid) => {
  return getPostList(cid).filter((p) => p.pubtime === pid)[0];
}

export const getDownloadList = () => {
  return [
    'b2ee3095802e53f965e9848142f1fe92',
    '95802e53f965e984814b2ee302f1fe92',
    '814b2ee309580965e9842e53f2f1fe92'
  ].map((fid) => getfile('a646e71efbba9a2c7f2c9f1c677e1a99', fid));
}

export const getFileStatus = getfile;
