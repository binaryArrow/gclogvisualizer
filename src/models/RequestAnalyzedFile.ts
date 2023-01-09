export class RequestAnalyzedFile {
  filename: string;
  // x < 800ms
  bestResponses: number[];
  // 800ms <= x < 1200ms
  okResponses: number[];
  //  x >= 1200ms
  badResponses: number[];

  failedResponses: number[];

  constructor(
    filename: string,
    bestResponses: number[],
    okResponses: number[],
    badResponses: number[],
    failedResponses: number[]
  ) {
    this.filename = filename;
    this.bestResponses = bestResponses;
    this.okResponses = okResponses;
    this.badResponses = badResponses;
    this.failedResponses = failedResponses;
  }

  toCSVString(): string{
    return ""
  }
}
