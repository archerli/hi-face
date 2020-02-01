const testImage = 'https://n1image.hjfile.cn/res7/2020/01/31/8ab8ff439233f3beae97a06c2b2bdec2.jpeg'

import Taro, { Component } from '@tarojs/taro'
import { View, Image, Input, Button, Canvas } from '@tarojs/components'
// import PageWrapper from 'components/page-wrapper'
import ImageCropper from 'components/image-cropper-taro'
import fetch from 'utils/fetch'
import { apiAnalyzeFace } from 'constants/apis'
import { getSystemInfo } from 'utils/common'
import { getHatInfo, getBase64Main } from 'utils/face-utils'
import { drawing } from 'utils/canvas-drawing'

import { NOT_FACE, ONE_FACE } from 'constants/image-test'
import { TaroCropper } from 'taro-cropper'

const testImg = 'https://n1image.hjfile.cn/res7/2020/01/31/85a57f8e140431329c0439a00e13c1a0.jpeg'

const imageData = ONE_FACE

import './styles.styl'

const { windowWidth } = getSystemInfo()
const CANVAS_SIZE = '300'

// @CorePage
class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
  }

  constructor(props) {
    super(props);
    this.catTaroCropper = this.catTaroCropper.bind(this);
    this.state = {
      originSrc:  '', //testImg,
      cutImagePath: '' //testImg,
    }
  }



  catTaroCropper(node) {
    this.taroCropper = node;
    console.log('this.taroCropper :', this.taroCropper);
  }

  onChooseImage = () => {
    Taro.chooseImage({
      count: 1
    }).then(res => {
      // console.log(res);
      this.setState({
        originSrc: res.tempFilePaths[0]
      });
    })
  }

  onCut = (cutImagePath) => {
    // console.log('onCut res :', cutImagePath);
    // Taro.getImageInfo({
    //   src: cutImagePath,
    //   success: function (res) {
    //     console.log(res.width)
    //     console.log(res.height)
    //   }
    // })
    this.setState({
      cutImagePath: cutImagePath,
      originSrc: ''
    })
  }

  onCancel = () => {
    this.setState({
      originSrc: ''
    })
    Taro.showToast({
      icon: 'none',
      title: '点击取消'
    })
  }

  downloadImage = () => {
    const { cutImagePath } = this.state
    Taro.saveImageToPhotosAlbum({
      filePath: cutImagePath,
      success: res => {
        console.log('保存成功 :');
      },
      fail(e) {
        console.log("err:" + e);
      }
    });
  }

  render() {
    const {
      originSrc,
      cutImagePath
    } = this.state;

    return (
      <View className={'mask-page'}>
        <View className='main-wrap'>
          {cutImagePath
            ? (
              <View className='image-wrap'>
                <Image
                  src={cutImagePath}
                  mode='widthFix'
                  className='image-selected'
                />

              </View>
            )
            : (
              <View className='to-choose' onClick={this.onChooseImage}>
              </View>
            )
          }
          {!!cutImagePath && (
            <View className='button-wrap'>
              <Button className='button-remove'></Button>
              <Button className='button-download'></Button>
            </View>
          )}
        </View>

        {
          cutImagePath && (
            <Button onClick={this.downloadImage}>下载图片</Button>
          )
        }
        <View className='cropper-wrap' hidden={!originSrc}>
          <TaroCropper
            src={originSrc}
            cropperWidth={CANVAS_SIZE * 2}
            cropperHeight={CANVAS_SIZE * 2}
            ref={this.catTaroCropper}
            fullScreen
            onCut={this.onCut}
            hideCancelText={false}
            onCancel={this.onCancel}
          />
        </View>
      </View>
    )
  }
}