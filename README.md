# epc-hook-components
> 倚天汽配宝典自定义组件资源

## 使用方法
1. 使用 `npm install && npm run build` 编译本项目
```shell
> epc-hook-components@1.0.0 build /Users/BangZ/Documents/qipeipu/epc-hook-components
> rollup --config rollup.config.ts --configPlugin typescript

./src/main.ts → ./dist/lib.js...
created ./dist/lib.js in 16.1s
```
2. 将打包出来的 `dist` 目录整个上传到静态资源服务器去
3. 静态资源服务器需配置允许 js 文件请求跨域 `Access-Control-Allow-Origin: *`
```shell
# /etc/nginx/nginx.conf
#
# nginx 服务器配置
#
location / {
     if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        #
        # Custom headers and headers various browsers *should* be OK with but aren't
        #
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        #
        # Tell client that this pre-flight info is valid for 20 days
        #
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
     }
     if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
     }
}
```
4. 将最终得到的静态资源地址传入应用内倚天 sdk 即可
```html
<yitian-sdk hook-url="https://example.com/lib.js" ... />
```

## 本地开发
1. 使用 `npm run dev` 可开启 watch 模式实时打包
2. 使用 `npm run host` 可在本地开启 http-server 进行快速调试
3. 将 http-server 启动后给出的地址，拼接成 dist 目录下 lib 文件的地址，传入倚天 sdk
```html
<yitian-sdk hook-url="http://127.0.0.1:8082/lib.js" ... />
```
4. 通过 sdk 打开倚天对应的页面即可看到效果

## 注意事项
1. `src/main.ts` 内的代码为本项目的导出组件，导出组件的组件名不可修改，不需要 hook 的组件，可以不导出
2. 项目中采用了 `rollup` 作为打包工具，在打包出最终结果时，会忽略掉几个库，改为调用倚天的库，以减小项目体积，详见 `rollup.config.ts` 中 `output.globals` 的定义


## 原理
本项目其实类似于一个组件库，`src/main.ts` 中导出需要加载的组件，并且将该文件作为整个库的入口，最终导出为 umd 文件格式给倚天汽配宝典使用
