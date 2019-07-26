import * as hash from 'object-hash';
import * as crypto from 'crypto';
import * as R from 'ramda';
import { IPostInfo } from '../types';

export const md5 = (buffer: Buffer) => {
  return crypto.createHash('md5').update(buffer)
    .digest('hex');
};

export const verifyPostInfo = (publicKey: crypto.KeyObject, postinfo: IPostInfo) => {

  if (!postinfo || !publicKey) {
    return false;
  }

  const verify = crypto.createVerify('SHA256');
  verify.update(hash(postinfo, { excludeKeys: R.equals('signature') }));
  verify.end();

  return verify.verify(publicKey, postinfo.signature, 'hex');

};

export const signPostInfo = (privateKey: crypto.KeyObject, postinfo: IPostInfo) => {
  const sign = crypto.createSign('SHA256');
  sign.update(hash(postinfo, { excludeKeys: R.equals('signature') }));
  sign.end();

  return sign.sign(privateKey, 'hex');
};

export const string2pubkey = (publicKey: string) => {
  return crypto.createPublicKey({
    key: Buffer.from(publicKey, 'hex'),
    type: 'pkcs1',
    format: 'der'
  });
};
export const string2prvkey = (Private: string) => {
  return crypto.createPrivateKey({
    key: Buffer.from(Private, 'hex'),
    type: 'pkcs1',
    format: 'der'
  });
};
export const key2string = (key: crypto.KeyObject) => {
  return key.export({
    type: 'pkcs1',
    format: 'der'
  }).toString('hex');
};

export const generateChannelID = (publicKey: string) => {
  return md5(Buffer.from(publicKey, 'hex'));
};

export const verifyPublicKey = (cid: string, publicKey: string | crypto.KeyObject) => {
  if (!publicKey) {
    return false;
  }

  if (typeof publicKey !== 'string') {
    publicKey = key2string(publicKey);
  }

  return generateChannelID(publicKey) === cid;
};

declare interface IKeyPair {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
}

export const generateKeyPair = async (): Promise<IKeyPair> => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', { modulusLength: 2048 }, (err, publicKey, privateKey) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          publicKey,
          privateKey
        });
      }
    });
  });
};
