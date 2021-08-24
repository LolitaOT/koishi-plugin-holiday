import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import fs from 'fs'
import path from 'path'
// 为了ts能正常将文件转移到正常位置
import './xml.json'

export interface SpeechComposeConfig{
  key: string,
  region: string
}
export class SpeechCompose {
  config
  constructor(config: SpeechComposeConfig) {
    this.config = config
  }
  private speakSsml(speechConfig: sdk.SpeechConfig, audioConfig: sdk.AudioConfig, ssml: string):Promise<string> {
    return new Promise((resolve,reject) => {
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)
      synthesizer.speakSsmlAsync(ssml, result => {
        synthesizer.close();
        if (result) {
          resolve('ok')
        } else {
          reject(new Error('未能正常返回音频流。'))
        }
      },
      error => {
        synthesizer.close();
        reject(error)
      });
    })
  }
  private async buildFilepath(filename:string): Promise<string> {
    try {
      await fs.promises.mkdir(path.resolve(__dirname, 'audio'))
    }catch(e) {
      //
    }
    return path.resolve(__dirname, 'audio', filename + '.wav')
  }
  async speak(text:string, filename: string): Promise<string> {
    const speechConfig = sdk.SpeechConfig.fromSubscription(this.config.key, this.config.region);
    const filepath = await this.buildFilepath(filename)
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filepath);
    const raw = await fs.promises.readFile(path.resolve(__dirname, './xml.json'))
    const ssmlRaw = JSON.parse(raw.toString())
    const lang = 'zh-CN'
    const langConfig = ssmlRaw.lang[lang][0]
    const t:string = ssmlRaw.xml
    const ssml = t.replace('$lang$',lang)
    .replace('$voiceName$', langConfig.voiceName)
    .replace('$style$', langConfig.defaultConfig.style)
    .replace('$styledegree$', langConfig.defaultConfig.styledegree)
    .replace('$text$', text)
    await this.speakSsml(speechConfig,audioConfig, ssml)
    return filepath
    // return ''
  }
}