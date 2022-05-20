// Finally, I decided to give up this shit

// Always helps myself

// Use Chrome API
export default function Recorder(config = {}, stream) {
  // 录音采样位数 8 or 16
  config.sampleBits = config.sampleBits || 8
  // 录音采样率 1/6 * 44100
  config.sampleRate = config.sampleRate || (44100 / 6)

  const context = window.AudioContext
  // 媒体流音频源
  const audioInput = context.createMediaStreamSource(stream)
  // js 音频处理器
  const scriptProcessor = context.createScriptProcessor
  const recorder = scriptProcessor.apply(context, [4096, 1, 1])

  const audioConfig = {
    // 录音初始大小/长度
    size: 0,
    // 录音缓存
    buffer:[],
    // 输入输出采样位数/采样率
    inputSampleBits: config.sampleBits,
    inputSampleRate: config.sampleRate,
    outputSampleBits: config.sampleBits,
    outputSampleRate: config.sampleRate,

    // 音频数据输入处理方法
    input: function (data) {
      this.size += data.length
      this.buffer.push(new Float32Array(data))
    },

    // 音频数据合并压缩
    compress: function () {
      // 合并
      const data = new Float32Array(this.size)
      let offset = 0
      for (let i = 0; i < this.buffer.length; i++) {
        let value = this.buffer[i]
        data.set([value], offset)
        offset += value.length
      }

      // 压缩
      // 压缩百分比 x => 压缩成原来的百分之 x
      const compression = parseInt(this.inputSampleRate / this.outputSampleRate)
      const length = data.length / compression
      const result = new Float32Array(length)
      let i = 0, j = 0
      while (i < length) {
        result[i] = data[j]
        j += compression
        i++
      }

      return result
    },

    // 将录音数据压缩成 wav 格式
    encodeWAV: function () {
      const sampleBits = Math.min(this.inputSampleBits, this.outputSampleBits)
      const sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate)

      const bytes = this.compress()
      const dataLength = bytes.length * (sampleBits / 8)
      const buffer = new ArrayBuffer(44 + dataLength)
      const data = new DataView(buffer)

      // 单声道录音
      const channelCount = 1
      let offset = 0

      const writeString = (str) => {
        for (let i = 0; i < str.length; i++) {
          data.setUint8(offset + i, str.charAt(i))
        }
      }

      // I guess the codes below are used to describe the meta information of wav file

      // 资源交换文件标识符
      writeString('RIFF')
      offset += 4
      // 下个地址开始到文件尾总字节数，即文件大小 - 8
      data.setUint32(offset, 36 + dataLength, true)
      offset += 4
      // WAV 文件标志
      writeString('WAVE')
      offset += 4
      // 波形格式标志
      writeString('fmt ')
      offset += 4
      // 过滤字节，一般为 0x10 = 16
      data.setUint32(offset, 16, true)
      offset += 4
      // 格式类别 (PCM形式采样数据)
      data.setUint16(offset, 1, true)
      offset += 2
      // 通道数
      data.setUint16(offset, channelCount, true)
      offset += 2
      // 采样率，每秒样本数，表示每个通道的播放速度
      data.setUint32(offset, sampleRate, true)
      offset += 4
      // 波形数据传输率 (每秒平均字节数) 单声道 × 每秒数据位数 × 每样本数据位 / 8
      data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true)
      offset += 4
      // 快数据调整数 采样一次占用字节数 单声道 × 每样本的数据位数 / 8
      data.setUint16(offset, channelCount * (sampleBits / 8), true)
      offset += 2
      // 每样本数据位数
      data.setUint16(offset, sampleBits, true)
      offset += 2
      // 数据标识符
      writeString('data')
      offset += 4
      // 采样数据总数，即数据总大小-44
      data.setUint32(offset, dataLength, true)
      offset += 4

      // 写入采样数据
      if (sampleBits === 8) {
        for (let i = 0; i < bytes.length; i++, offset++) {
          let s = Math.max(-1, Math.min(1, bytes[i]))
          let val = s < 0 ? s * 0x8000 : s * 0x7FFF
          val = parseInt(255 / (65535 / (val + 32768)))
          data.setInt8(offset, val, true)
        }
      } else {
        for (let i = 0; i < bytes.length; i++, offset += 2) {
          let s = Math.max(-1, Math.min(1, bytes[i]))
          data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
        }
      }

      return new Blob([data], { type: 'audio/mp3' });
    },
  }

  // 开始录制
  this.start = function () {
    audioInput.connect(recorder)
    recorder.connect(context.destination)
  }

  // 停止录制
  this.stop = function () {
    recorder.disconnect()
  }

  function getBlob() {
    this.stop()
    return audioConfig.encodeWAV()
  }

  // https://www.cnblogs.com/h5it/p/11124987.html
  this.play = function () {

  }

}