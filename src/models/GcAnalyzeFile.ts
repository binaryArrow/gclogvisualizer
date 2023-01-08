export class GcAnalyzeFile {
  gcName: string
  stwTotalTime: number

  constructor(gcName: string, stwTotalTime: number) {
    this.gcName = gcName
    this.stwTotalTime = stwTotalTime
  }

}
