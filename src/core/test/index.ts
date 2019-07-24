import * as Proline from '..';
import Peers from '../peers/Peers';
import Posts from '../posts/Posts';

const port = Number(process.argv[2]);

Proline.server.listen(port);

console.log(`listening on http://localhost:${port}`);

if (port === 23334) {

  const main = async () => {

    const pr = new Proline.Peer('::1', 23333);
    Peers.addPeer(pr);
    const cid = 'c627d20ef87a09bc090b9dfba55ba61a';

    await pr.pushUpdate(cid, {
      pid: '23333',
      title: '这是第二篇文章',
      pubtime: 51115335544,
      content: '这是第二篇文章的内容',
      files: [],
      signature: '421e8fcbab63687e0989e03d3e8c280e3394d89a6f04b2e0a56de3eb79dbd06a77a3b6e10168481a5d45d1ddd0f985ec2c99bd6f008d885387d77f5cf6bee91c1813d9587afc678fe60f07e23cf2cf1a8199f313d9dbda3c050d623fb02c4e15c3ba9106b20728cc1a5ede543adc30d3f52f974d2517839b1a1cecf9465abe74a28ab9e4f816f04b5970a894f966df29b25458c1058f1ef06203905738e27c18702f10adbec27eb33ae16a75df2f543a6b572f72fe74016bac3a33ecd46a072128ddbf63c430f4252552735d3daa0de3c6b4cd15881afcffdd2a89b18a2d8e64f1adce20015f794d37fb104bc01b11a88f23ad75ade08f5cc54e59e93ed4fa78'
    });
  };

  main();
}
