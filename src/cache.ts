import schedule from 'node-schedule'
import { parseTime } from './utils'
import fs from 'fs'

interface Cache {
  ttl: string,
  file: string
}
interface CacheType {
  [index:string]: Cache
}

export class ResponseCache {
  cache:CacheType
  useAudio
  constructor(useAudio = true) {
    this.cache = {}
    this.useAudio = useAudio
  }
  async clean(): Promise<void> {
    if(this.useAudio) {
      for (const key in this.cache) {
        await fs.promises.unlink(this.cache[key].file)
      }
    }
    this.cache = {}
  }
  buildKey(type: string): string {
    return parseTime(new Date()) + '_' + type
  }
  autoClean(): void {
    const rule = new schedule.RecurrenceRule()
    rule.date = 0
    schedule.scheduleJob(rule,this.clean)
  }
  get(key: string): Cache | undefined {
    return this.cache[key]
  }
  set(key: string, value: Cache): void{
    if(!this.cache[key]){
      this.cache[key] = value
    }
  }
}