declare module 'fuse.js' {
  export interface FuseOptions {
    keys?: (string | { name: string; weight?: number })[];
    threshold?: number;
    includeScore?: boolean;
    minMatchCharLength?: number;
    [key: string]: any;
  }

  export interface FuseResult {
    item: any;
    score?: number;
    [key: string]: any;
  }

  export default class Fuse {
    constructor(items: any[], options?: FuseOptions);
    search(query: string): FuseResult[];
  }
}
