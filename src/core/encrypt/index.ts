import * as hash from 'object-hash';
import * as crypto from 'crypto';
import * as R from 'ramda';
import { IPostInfo, SignObject } from '../types';

/**
 * 计算 md5
 * @param {Buffer} buffer 输入
 */
export const md5 = (buffer: Buffer) => {
  return crypto.createHash('md5')
    .update(buffer)
    .digest('hex');
};

/**
 * 获得签名
 * @param {crypto.KeyObject} privateKey 私钥
 * @param {SignObject} object 签名对象
 */
export const signObject = <T extends SignObject> (privateKey: crypto.KeyObject, object: T) => {
  const sign = crypto.createSign('SHA256');
  sign.update(hash(object, { excludeKeys: R.equals('signature') }));
  sign.end();

  return sign.sign(privateKey, 'hex');
};

/**
 * 字符串转公钥
 * @param {string} publicKey 公钥
 */
export const string2pubkey = (publicKey: string) => {
  return crypto.createPublicKey({
    key: Buffer.from(publicKey, 'hex'),
    type: 'pkcs1',
    format: 'der',
  });
};

/**
 * 字符串转私钥
 * @param {string} privateKey 私钥
 */
export const string2prvkey = (privateKey: string) => {
  return crypto.createPrivateKey({
    key: Buffer.from(privateKey, 'hex'),
    type: 'pkcs1',
    format: 'der',
  });
};

/**
 * 秘钥转 hex 字符串
 * @param {crypto.KeyObject} key 秘钥
 */
export const key2string = (key: crypto.KeyObject) => {
  return key.export({
    type: 'pkcs1',
    format: 'der',
  }).toString('hex');
};

/**
 * 获取公钥的频道 id
 * @param {string} publicKey 公钥
 */
export const generateChannelID = (publicKey: string) => {
  return md5(Buffer.from(publicKey, 'hex'));
};

/**
 * 验证公钥，经过柯里化
 */
export const verifyPublicKey = (cid: string) => (publicKey: string) => {
  if (!publicKey) {
    return false;
  }

  return generateChannelID(publicKey) === cid;
};

/**
 * 验证签名，经过柯里化
 */
export const verifySignature = (publicKey: crypto.KeyObject) => (signed: SignObject) => {

  if (!signed || !publicKey) {
    return false;
  }

  const verify = crypto.createVerify('SHA256');
  verify.update(hash(signed, { excludeKeys: R.equals('signature') }));
  verify.end();

  return verify.verify(publicKey, signed.signature, 'hex');

};

/**
 * 秘钥对
 */
declare interface IKeyPair {
  publicKey: crypto.KeyObject;
  privateKey: crypto.KeyObject;
}

/**
 * 生成随机密钥对
 */
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
