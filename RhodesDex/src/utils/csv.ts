import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'
import type { EventData, EliteData } from '../types/ranking'

export async function loadCsv<T extends EventData | EliteData>(url: string): Promise<T[]> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`CSV 读取失败：HTTP ${response.status}`)
  }

  const csvText = await response.text()

  const result: ParseResult<T> = Papa.parse<T>(csvText, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    throw new Error(`CSV 解析失败：${result.errors[0].message}`)
  }

  return result.data
}
