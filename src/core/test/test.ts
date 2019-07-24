import { generateKeyPair, signPostInfo, string2prvkey } from '../encrypt';
import { IPostInfo } from '../types';

const privateKey = string2prvkey('308204a20201000282010100d18b2528c5c44a9887d3b2c898b9dc83e8df544d6460081412c0daec61ccf0df729499ff44e91c4d1c9e556d560a5bdb0d8fffa7e68ddeec4d3973beca1f85983f392223b227f836da8ea1a6e613abf0f3c8015e4f917db7f7264572d4c029a9681f22f7230d52dd70758e6b404ae6b9d60b761a3a234a7b8a2ed59c5b0a31b1fdde769a08e48b546d6f9dd4470a3e3b4b8f9773c297e033e07da909faf5ed85ba3c56bf430b847dfd12bd58c772af78c6a479f4e00de9fd2ef99a5aa22d56bf776fb72719e740788930efda823059f5112d4ec395736d008d8d674b9d60c2c2e36d87069e520822076d0ce39d960dcbfd3f05feef59585d422c6fdcf94825f502030100010282010035015fbafa9bf6cab2c1285e79d3ba265c07f2494974c9565a901250ed446c41f9b801648347fc72bd2488338a2a40a61ebe284b8e94a0a961b780c1e85b24ee28400994c2023e5591dfb6a0835ec285c704f6e3a67905363dfc9e60b7d48c3560335022f7e8ece73b0561ab5bae16c33793daa233c6ad96a693c65130ee593759eebfa863cd298c430e02aad0b5d4241eacde3726ad5deb71f236caa40a8d99fcefbbd54fa1435752e15945048f53df56516f91a4b1683d8250f756ad8cce1fe8e79214fd04a7d5cb1abadf5ed5f85f2a349bd42bea879323c8336eea009afed1ba0f0325b5c805a6ff9d8000b430b3c7e798b901b71707d83e8854045e020102818100ec98267df6761567c480792596f2a508efa52cf518e4840cd1be1405723a749cad4f2f05fa8b0755e8fa14702baa5a5c227aedad24de5dc2c206d72d5a5115a5be76c398debbd15ff939e4ca3c53d742ec56f3d41248a0b7c8dbc8d7f9f5b0fe5eb3a6a3b574f779fd46aec6c9b91bb9580bae17b32969eebb290967b680e3b502818100e2bb000a3aae3f2cebbb921fa4311880ab45e995595cd01c4fdb953097d8e132c35558d04ce0ecf2dc866b98fdcdd2bd2cc8536fb8ea3a9e24749af8940f578ad5fb191a2e8b2199acd57102d7bcf58195b9138cc778f17173f1095b1ffb6840a986d0371ac21b719b1201d611893a3811560c324edee90b1f3c773058e4214102818074cb27354755437bd62515a8d8bb2f7d19d010416de860c77342c1df6e642cecab214bb547d919e5eefc84da5ab3dda75dde113647dcfdac06dc199ce9d8dd36d4af0c1f8ad46ca75400a050b5372e2c7b3ef15edf27bb2efe9880ad1d578be80617e94b2768764262256261ff72c19cdd39e6d70c3a8570b433add0e4e6fb810281807c41174883d8326f1fd16fc73f6858914b4bc9333c020d5b36b8940e4969662137c37224d5bcfe9e2a14d0aacb8d1ccce7d9f13fed0b108cd255c5082dbc2ab1bf8b18baac7f3b2ec8f54035da9d87be389b710759da0217b6fe85ae16dce4c96b1ea2c55038c8697e1e643b38e907aaea7549c1d84f794fcb128c0f46e7df0102818019ff6275505e9a8e0f1b467ea81c7ec35b650683b30805462745fef47e9f81bf200a3392fdf2a663a51d795ecc0c1a85405c69e6d04f350f45adbef914e95a9f6abe67adc0dfc30b994fcc5e37b4b3b67ed2437171aba8a2c23d6bf5e82aef8c91bfa403dde76aa55ebabf67ce76228db594275fc033db1628c304448d897d00');

const post: IPostInfo = {
  pid: '23333',
  title: '这是第二篇文章',
  pubtime: 51115335544,
  content: '这是第二篇文章的内容',
  files: [],
  signature: '2333'
};
post.signature = signPostInfo(privateKey, post);

console.log(post);
