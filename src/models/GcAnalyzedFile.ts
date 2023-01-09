export class GcAnalyzedFile {
  gcName: string
  fileName: string
  stwTotalTime: number

  constructor(gcName: string, fileName: string, stwTotalTime: number) {
    this.gcName = gcName
    this.fileName = fileName
    this.stwTotalTime = stwTotalTime
  }

}
