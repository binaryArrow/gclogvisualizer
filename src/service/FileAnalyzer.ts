import { GcAnalyzeFile } from "@/models/GcAnalyzeFile";

export class FileAnalyzer {

  static readTotalPauseTime(logs: string[]): GcAnalyzeFile | null {
    const GCAlgorithmCheck = logs.slice(0, 10);
    let totalPauseTime: number = 0;
    let gcName: string = ''
    switch (this.findGCAlgorithm(GCAlgorithmCheck)) {
      case GCAlgorithms.PARALLEL: {
        totalPauseTime = this.readTotalPauseTimeOfParallelSerialG1GC(logs);
        gcName = 'Parallel GC'
        break;
      }
      case GCAlgorithms.SERIAL: {
        totalPauseTime = this.readTotalPauseTimeOfParallelSerialG1GC(logs);
        gcName = 'Serial GC'
        break;
      }
      case GCAlgorithms.Z: {
        console.log('Z');
        break;
      }
      case GCAlgorithms.SHENANDOAH: {
        totalPauseTime = this.readTotalPauseTimeOfShenandoahGC(logs)
        gcName = 'Shenandoah GC'
        break;
      }
      case GCAlgorithms.G1: {
        totalPauseTime = this.readTotalPauseTimeOfParallelSerialG1GC(logs)
        gcName = 'G1 GC'
        break;
      }
      default:
        return null;
    }

    return new GcAnalyzeFile(gcName, totalPauseTime)
  }

  static readTotalPauseTimeOfShenandoahGC(logs: string[]): number {
    let totalPauseTimes = 0;
    let lastClosedBracket = 0;
    let indexOfFirstGCPause = logs.findIndex(line => line.includes("GC"));
    logs.slice(indexOfFirstGCPause).forEach(line => {
      lastClosedBracket = line.lastIndexOf(")");
      if (!isNaN(parseFloat(line.slice(lastClosedBracket + 1, line.length - 2))) && line.includes('Pause'))
        totalPauseTimes += parseFloat(line.slice(lastClosedBracket + 1, line.length - 2));
    });
    return Math.round(totalPauseTimes);
  }

  // reads pause times of GC log and returns total pause time
  static readTotalPauseTimeOfParallelSerialG1GC(logs: string[]): number {
    let totalPauseTimes = 0;
    let lastClosedBracket = 0;
    let indexOfFirstGCPause = logs.findIndex(line => line.includes("GC"));
    logs.slice(indexOfFirstGCPause).forEach(line => {
      lastClosedBracket = line.lastIndexOf(")");
      if (!isNaN(parseFloat(line.slice(lastClosedBracket + 1, line.length - 2))))
        totalPauseTimes += parseFloat(line.slice(lastClosedBracket + 1, line.length - 2));
    });
    return Math.round(totalPauseTimes);
  }


  static findGCAlgorithm(firstTenLogLines: string[]): GCAlgorithms | null {

    if (firstTenLogLines.find(line => line.includes("Using Parallel")))
      return GCAlgorithms.PARALLEL;

    if (firstTenLogLines.find(line => line.includes("Using Serial")))
      return GCAlgorithms.SERIAL;

    if (firstTenLogLines.find(line => line.includes("Using G1")))
      return GCAlgorithms.G1;

    if (firstTenLogLines.find(line => line.includes("Using The Z Garbage Collector")))
      return GCAlgorithms.Z;

    if (firstTenLogLines.find(line => line.includes("Using Shenandoah")))
      return GCAlgorithms.SHENANDOAH;

    else
      return null;

  }

}

enum GCAlgorithms {
  "PARALLEL",
  "SERIAL",
  "G1",
  "Z",
  "SHENANDOAH",
}
