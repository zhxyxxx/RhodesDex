import Papa from 'papaparse'
import type { ParseResult } from 'papaparse'
import type { EventData, EliteData, ItemData } from '../types/ranking'

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

// 获取 JSON 数组并解析为指定元素类型的列表
export async function loadJson<T extends ItemData>(url: string): Promise<T[]> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`JSON 读取失败：HTTP ${response.status}`)
  }

  let jsonData: unknown

  try {
    jsonData = await response.json()
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`JSON 解析失败：${message}`)
  }

  if (!Array.isArray(jsonData)) {
    throw new Error('JSON 格式错误：预期顶层数据为数组')
  }

  return jsonData as T[]
}
