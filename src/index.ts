import axios from 'axios';

const API = 'https://api.bilibili.com/x/web-interface/view';
const HEADER = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
};

interface RequestError extends Error {
  errorCode: number;
}

interface BVInfo {
  title: string;
  desc: string;
  cover: string;
  bvID: string;
  avID: string;
  avUrl: string;
  bvUrl: string;
}

class RequestError extends Error {
  constructor(code: number, msg: string) {
    super(msg);
    this.name = 'RequestError';
    this.errorCode = code;
  }
  toString(): string {
    return `[${this.errorCode}] Request failed: ${this.message}`;
  }
}

export async function getBvInfo(bv: string): Promise<BVInfo> {
  const rsp = await axios.get(API, {
    params: {
      bvid: bv,
    },
    headers: HEADER,
  });
  if (rsp.status !== 200) {
    throw new RequestError(rsp.status, rsp.statusText);
  }
  if (rsp.data.code !== 0) {
    throw new RequestError(rsp.data.code, rsp.data.message);
  }
  const { bvid, aid, pic, title, desc } = rsp.data.data;
  return {
    title,
    desc,
    cover: pic,
    avID: `av${aid}`,
    bvID: bvid,
    avUrl: `https://www.bilibili.com/video/av${aid}`,
    bvUrl: `https://www.bilibili.com/video/${bvid}`,
  };
}

export async function bv2av(bv: string): Promise<string> {
  const info = await getBvInfo(bv);
  return info.avID;
}
