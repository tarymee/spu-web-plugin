declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'co'
declare module 'uuid'


declare module '*.js'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
// declare module '*.bmp'
// declare module '*.tiff'

// declare module 'the-answer'

interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
  // Native Module aPaaS 为 G3 SPU 容器注入的 Native-API
  Native: any
  Module: any;
  aPaaS: any;
  // 日志插件 和 日志实例
  ApaasSpuTrack: any;
  apaasSpuTrack: any;
  // wx: IAny;
  // AMapUI: IAny;
  // lsProxy: any;
  // ssProxy: any;
  // xtion: any;
  // // eslint-disable-next-line camelcase
  // __wxjs_environment: string;
  // // eslint-disable-next-line camelcase
  // smart100_h5_set_isshowhead: IFunction;
  // // eslint-disable-next-line camelcase
  // smart100_h5_set_isdebugger: IFunction;
  // // eslint-disable-next-line camelcase
  // smart100_h5_set_ispermission: IFunction;
  // // eslint-disable-next-line camelcase
  // smart100_h5_set_isvirtuallocation: IFunction;
  // // eslint-disable-next-line camelcase
  // smart100_h5_set_whennotloggedisautojumplogin: IFunction;
}
