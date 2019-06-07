export const getChannelList = () => {
  return [{
    title: '足各神社',
    chanid: 'a646e71efbba9a2c7f2c9f1c677e1a99',
    newpost: 1
  }, {
    title: '足各绅士',
    chanid: '095802e53f965e984814b2ee32f1fe92',
    newpost: 2
  }, {
    title: '足各-hentai',
    chanid: 'a936326412d1314b76209fbece109ff2',
    newpost: 0
  }];
}

export const getChannelInfo = (cid) => {
  return getChannelList().filter((c) => c.chanid === cid)[0];
}

export const getPostList = (cid) => {
  if (cid === '095802e53f965e984814b2ee32f1fe92') {
    return [{
      title: '性感足各在线女装',
      pubtime: 1558228415020,
      content: '足各真可爱 awsl wwwwwwww',
      files: [{
        title: '足各 1.zip',
        size: 155800020
      }, {
        title: '足各 2.zip',
        size: 198484615
      }, {
        title: '足各 3.zip',
        size: 2154679848
      }],
      read: false
    }, {
      title: '足各好可爱啊啊啊啊啊',
      pubtime: 1548227405020,
      content: '大型阿伟乱葬场 awsl',
      files: [ ],
      read: true
    }]
  }

  return [];
}

export const getPostInfo = (cid, pid) => {
  return getPostList(cid).filter((p) => p.pubtime === pid)[0];
}
