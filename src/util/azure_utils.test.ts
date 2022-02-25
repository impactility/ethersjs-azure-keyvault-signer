/* eslint-disable max-len */
import {BN} from 'bn.js';
import {getEthereumAddress,
  determineCorrectV,
  findEthereumSig,
} from './azure_utils';

describe('getEthereumAddress', () => {
  test('should work correctly', async () => {
    const samplePubKey = Buffer.from(
        '0409105dfda9045744bb7e0b6b922b4bfcf339406778606ea583d31fc2244108568bfdd37a151612797e61ab1dbbf9e6d82efa66204c654d8585e89dc470923061',
        'hex',
    );
    expect(await getEthereumAddress(samplePubKey)).toBe('0xd9e57b0f2e81eb2233a4055296be4a74ecf8a4de');
  });
  test('should fail on truncated key', async () => {
    const samplePubKey = Buffer.from(
        '0409105dfda9045744bb7e0b6b922b4bfcf339406778606ea583d31fc2244108568bfdd37a151612797e61ab1dbbf9e6d82efa6',
        'hex',
    );
    expect(await getEthereumAddress(samplePubKey)).not.toEqual('0xd9e57b0f2e81eb2233a4055296be4a74ecf8a4de');
  });
});

describe('findEthereumSig', () => {
  test('should work correctly', () => {
    const sampleSignature = Buffer.from(
        '13aac9c6a526ad400a281835648b57d3f5c63c03544396ce241d6a763a462d265ae2d02a6f99d8671c3c84cd403baa7e8a3e477631d8e7d22aecc4c1e3c96f2a',
        'hex',
    );
    expect(JSON.stringify(findEthereumSig(sampleSignature))).toBe(
        '{"r":"13aac9c6a526ad400a281835648b57d3f5c63c03544396ce241d6a763a462d26","s":"5ae2d02a6f99d8671c3c84cd403baa7e8a3e477631d8e7d22aecc4c1e3c96f2a"}',
    );
  });
});

describe('determineCorrectV', () => {
  test('should get correct V if it is 28', () => {
    const sampleMsg = Buffer.from('a1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2', 'hex');
    const sampleR = new BN('fa754063b93a288b9a96883fc365efb9aee7ecaf632009baa04fe429e706d50e', 16);
    const sampleS = new BN('6a8971b06cd37b3da4ad04bb1298fda152a41e5c1104fd5d974d5c0a060a5e62', 16);
    const expectedAddr = '0xe94e130546485b928c9c9b9a5e69eb787172952e';
    expect(determineCorrectV(sampleMsg, sampleR, sampleS, expectedAddr)).toMatchObject({
      pubKey: '0xE94E130546485b928C9C9b9A5e69EB787172952e',
      v: 28,
    });
  });
  test('should get correct V if it is 27', () => {
    const sampleMsg = Buffer.from('a1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2', 'hex');
    const sampleR = new BN('904d320777ceae0232282cbf6da3809a678541cdef7f4f3328242641ceecb0dc', 16);
    const sampleS = new BN('5b7f7afe18221049a1e176a89a60b6c10df8c0e838edb9b2f11ae1fb50a28271', 16);
    const expectedAddr = '0xe94e130546485b928c9c9b9a5e69eb787172952e';
    expect(determineCorrectV(sampleMsg, sampleR, sampleS, expectedAddr)).toMatchObject({
      pubKey: '0xE94E130546485b928C9C9b9A5e69EB787172952e',
      v: 27,
    });
  });

  test('should fail if something is invalid', () => {
    const sampleMsg = Buffer.from('8600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2', 'hex');
    const sampleR = new BN('777ceae0232282cbf6da3809a678541cdef7f4f3328242641ceecb0dc', 16);
    const sampleS = new BN('5b7f7afe18221049a1e176a89a60b6c10df8c0e838edb9b2f11ae1fb50a28271', 16);
    const expectedAddr = '0xd9e57b0f2e81eb2233a4055296be4a74ecf8a4de';
    expect(() => determineCorrectV(sampleMsg, sampleR, sampleS, expectedAddr)).toThrowError();
  });
});
