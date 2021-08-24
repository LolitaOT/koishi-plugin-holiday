import { Context, Logger, segment } from 'koishi'
import { SpeechCompose } from'./speechCompose'
import { Holiday } from './holiday'
import { ResponseCache } from './cache'

export const name = 'holiday'
export const logger = new Logger('holiday')
export let speechCompose: SpeechCompose

const holiday = new Holiday()
let responseCache: ResponseCache

async function r(cacheKey: string, callback: Function, useAudio = true) {
  let ttl:string
  let file: string
  const cache = responseCache.get(cacheKey)
  if(cache) {
    ttl = cache.ttl
    file = cache.file
  } else {
    ttl = await callback()
    if(useAudio) {
      file = 'file:///' +  await speechCompose.speak(ttl,cacheKey)
    } else {
      file = ''
    }
    responseCache.set(cacheKey, {ttl,file})
  }
  return { ttl, file }
}

interface Config {
  record?: {
    key: string,
    region: string
  }
}

function apply (ctx: Context, config: Config) {
  let useAudio = true
  if(config.record) {
    if(!config.record.key || !config.record.region) {
      logger.error('使用语音服务时，请传入key与region！')
      return 
    }
    speechCompose = new SpeechCompose({ key: config.record.key, region: config.record.region })
  } else {
    useAudio = false
  }
  responseCache = new ResponseCache(useAudio)


  ctx.command('holiday', '什么时候放假，快捷键[什么时候放假]').action( async ({ session }) => {
    try {
      const cacheKey = responseCache.buildKey('holiday')
      const { ttl,file } = await r(cacheKey,holiday.holiday, useAudio)
      if(useAudio) {
        session?.sendQueued(segment('record', { file }))
      }
      session?.sendQueued(ttl)
    }catch(e) {
      logger.error(e)
    }
    // return 
  }).shortcut('什么时候放假')

  ctx.command('holiday').subcommand('.next','什么时候休息，快捷键[什么时候休息]').action( async ({ session }) => {
    try {
      const cacheKey = responseCache.buildKey('nextHoliday')
      const { ttl,file } = await r(cacheKey,holiday.nextHoliday, useAudio)
      if(useAudio) {
        session?.sendQueued(segment('record', { file }))
      }
      session?.sendQueued(ttl)
    }catch(e) {
      logger.error(e)
    }
    // return 
  }).shortcut('什么时候休息')

  ctx.command('holiday').subcommand('.tomorrow', '明天上班吗，快捷键[明天上班吗]').action( async ({ session }) => {
    try {
      const cacheKey = responseCache.buildKey('tomorrow')
      const { ttl,file } = await r(cacheKey,holiday.tomorrow, useAudio)
      if(useAudio) {
        session?.sendQueued(segment('record', { file }))
      }
      session?.sendQueued(ttl)
    }catch(e) {
      logger.error(e)
    }
    // return 
  }).shortcut('明天上班吗')

}

export { apply }
