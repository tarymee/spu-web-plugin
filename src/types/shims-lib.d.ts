declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'co'
declare module 'uuid'

// declare module 'the-answer'

interface Window {
  _AMapSecurityConfig: {
    securityJsCode: string
  }
  // Native Module aPaaS 为 G3 SPU 容器注入的 Native-API
  Native: any
  Module: any;
  aPaaS: any;
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
