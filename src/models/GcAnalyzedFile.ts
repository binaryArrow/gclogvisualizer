export class GcAnalyzedFile {
  gcName: string
  fileName: string
  stwTotalTime: number
  sortNumber: number
  maxNumber?: number
  minNumber?: number
  constructor(gcName: string, fileName: string, stwTotalTime: number, maxNumber?: number, minNumber?: number) {
    this.gcName = gcName
    this.fileName = fileName
    this.stwTotalTime = stwTotalTime
    switch (gcName) {
      case 'Parallel GC': this.sortNumber = 0
        break;
      case 'Serial GC': this.sortNumber = 1
        break;
      case 'Shenandoah GC': this.sortNumber = 2
        break;
      case 'G1 GC': this.sortNumber = 3
        break;
      default: this.sortNumber = 4
    }
    this.maxNumber = maxNumber
    this.minNumber = minNumber
  }

}
