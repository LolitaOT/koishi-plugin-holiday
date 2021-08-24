import $ from './utils/request'

interface ResponseType {
  code: number,
  tts: string
}
export class Holiday {
  constructor() {
    //
  }
  // 最近放假安排
  async nextHoliday(): Promise<string> {
    const result:ResponseType = await $.get(`/tts`)
    if(result.code === 0) {
      return result.tts
    } else {
      throw new Error('请求接口时出现错误。')
    }
  }
  // 什么时候假期
  async holiday(): Promise<string> {
    const result:ResponseType = await $.get(`/tts/next`)
    if(result.code === 0) {
      return result.tts
    } else {
      throw new Error('请求接口时出现错误。')
    }
  }
  // 明天放假吗
  async tomorrow(): Promise<string> {
    const result:ResponseType = await $.get(`/tts/tomorrow`)
    if(result.code === 0) {
      return result.tts
    } else {
      throw new Error('请求接口时出现错误。')
    }
  }
}