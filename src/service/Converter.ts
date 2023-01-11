import type { RequestAnalyzedFile } from "@/models/RequestAnalyzedFile";
import { GcAnalyzedFile } from "@/models/GcAnalyzedFile";

export class Converter {

  static requestAnalyzedFilesToCSVFile(reqAnalyzedFiles: RequestAnalyzedFile[]): string {

    // 2 dimensionales array
    return [
      [
        "group",
        "bestResponses",
        "goodResponses",
        "badResponses"
      ],
      ...reqAnalyzedFiles.map((file, index) => [
        index + 1,
        file.bestResponses,
        file.goodResponses,
        file.badResponses
      ])
    ]
      .map(element => element.join(","))// join array elements comma seperated, first dimension
      .join("\n"); // join remaining arrays seperated with \n
  }

  static convertForD3Use(reqAnalyzedFiles: RequestAnalyzedFile[]): any[] {
    let objects: any[] = [];
    reqAnalyzedFiles.forEach((file, index) => {
      objects.push({
        index: (index + 1).toString(),
        bestResponses: file.bestResponses.toString(),
        goodResponses: file.goodResponses.toString(),
        badResponses: file.badResponses.toString(),
        failedResponses: file.failedResponses.toString()
      });
    });
    return objects;
  }

  // finds min and max values of gc analyzed files for multiple GCs and returns an array
  // with Analyzed files objects including min max properties
  static createMinMaxGcInfo(arrayOfAnalyzedGcs: GcAnalyzedFile[]): GcAnalyzedFile[] {
    let minMaxParallelGc, minMaxSerialGc, minMaxShenandoahGc, minMaxG1Gc, restGc;

    const parallelGcs = arrayOfAnalyzedGcs.filter(element => element.gcName == "Parallel GC");
    const serialGcs = arrayOfAnalyzedGcs.filter(element => element.gcName == "Serial GC");
    const shenandoahGcs = arrayOfAnalyzedGcs.filter(element => element.gcName == "Shenandoah GC");
    const g1Gcs = arrayOfAnalyzedGcs.filter(element => element.gcName == "G1 GC");
    const rest = arrayOfAnalyzedGcs.filter(element => element.gcName == "");

    if (parallelGcs.length > 0)
      minMaxParallelGc = this.minMaxFinder(parallelGcs);
    if (serialGcs.length > 0)
      minMaxSerialGc = this.minMaxFinder(serialGcs);
    if (shenandoahGcs.length > 0)
      minMaxShenandoahGc = this.minMaxFinder(shenandoahGcs);
    if (g1Gcs.length > 0)
      minMaxG1Gc = this.minMaxFinder(g1Gcs);
    if (rest.length > 0)
      restGc = this.minMaxFinder(rest)


      const results = [minMaxParallelGc, minMaxSerialGc, minMaxShenandoahGc, minMaxG1Gc, restGc];
    let filteredResults = results.filter(it => it != undefined);
    if (filteredResults.length == 0)
      filteredResults = [new GcAnalyzedFile("", "", 0)];
    // @ts-ignore there is always at least on element
    return filteredResults;
  }

  static minMaxFinder(arrayOfAnalyzedGcs: GcAnalyzedFile[]): GcAnalyzedFile {
    return new GcAnalyzedFile(
      arrayOfAnalyzedGcs[0].gcName,
      arrayOfAnalyzedGcs[0].fileName,
      0,
      Math.max(...arrayOfAnalyzedGcs.map(it => it.stwTotalTime)), // find max stw time
      Math.min(...arrayOfAnalyzedGcs.map(it => it.stwTotalTime)) // find min stw time

    );
  }

  static createResponseSummary(responseArray: RequestAnalyzedFile[]): RequestAnalyzedFile[] {
    const bestResponse = responseArray.find(it => it.bestResponses == Math.max(...responseArray.map(it => it.bestResponses)))
    const goodResponse = responseArray.find(it => it.goodResponses == Math.max(...responseArray.map(it => it.goodResponses)))
    const badResponse = responseArray.find(it => it.badResponses == Math.max(...responseArray.map(it => it.badResponses)))
    const failedResponse = responseArray.find(it => it.failedResponses == Math.max(...responseArray.map(it => it.failedResponses)))

    // @ts-ignore there will always be an entry
    return [bestResponse, goodResponse, badResponse, failedResponse]
  }
}
