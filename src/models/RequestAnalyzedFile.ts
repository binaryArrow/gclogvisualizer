export class RequestAnalyzedFile {
  filename: string;
  // x < 800ms
  bestResponses: number;
  // 800ms <= x < 1200ms
  goodResponses: number;
  //  x >= 1200ms
  badResponses: number;

  failedResponses: number;

  constructor(
    filename: string,
    bestResponses: number,
    goodResponses: number,
    badResponses: number,
    failedResponses: number
  ) {
    this.filename = filename;
    this.bestResponses = bestResponses;
    this.goodResponses = goodResponses;
    this.badResponses = badResponses;
    this.failedResponses = failedResponses;
  }

  toCSVString(): string{
    return ""
  }
}
