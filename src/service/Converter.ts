import type { RequestAnalyzedFile } from "@/models/RequestAnalyzedFile";
import { index } from "d3";

export class Converter {

  static requestAnalyzedFilesToCSVFile(reqAnalyzedFiles: RequestAnalyzedFile[]): string {

    // 2 dimensionales array
    return [
      [
        'group',
        'bestResponses',
        'goodResponses',
        'badResponses',
      ],
      ...reqAnalyzedFiles.map((file, index) => [
        index + 1,
        file.bestResponses,
        file.goodResponses,
        file.badResponses,
      ])
    ]
      .map(element => element.join(','))// join array elements comma seperated, first dimension
      .join('\n') // join remaining arrays seperated with \n
  }

  static convertForD3Use(reqAnalyzedFiles: RequestAnalyzedFile[]): any[] {
    let objects: any[] = []
    reqAnalyzedFiles.forEach((file, index) => {
      objects.push({
        index: (index + 1).toString(),
        bestResponses: file.bestResponses.toString(),
        goodResponses: file.goodResponses.toString(),
        badResponses: file.badResponses.toString(),
        failedResponses: file.failedResponses.toString()
      })
    })
    return objects
  }
}
