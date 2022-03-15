# 盯梢脚本模板

盯梢频道脚本除了可以在 [script.dingshao.cn](https://script.dingshao.cn) 直接编辑部署外，还可以使用 dss 命令构建后通过 npm 命令发布到盯梢脚本专有的 registry 地址（`https://script.dingshao.cn/registry/`）。

当前模板使用了 yarn 和 TypeScript，可以根据需要进行替换。

## 脚本开发

在当前模板中，找到 [src/script.ts](./src/script.ts) 文件，实现脚本内容。

> 脚本实现与线上基本相同，具体可参考 [@digshare/script](https://github.com/digshare/digshare-script)。不同于线上编辑的脚本，本地构建的脚本未提前引入依赖（包括 `@digshare/script` 和 `node-fetch`），需要自行引入。

在开发过程中，可以执行 `yarn dev-run` 进行测试。如果你打算使用 webhook 传入参数，可以修改 [src/dev-run.ts](./src/dev-run.ts) 中的 `payload` 进行模拟。

## 脚本部署

1. 在盯梢应用上创建频道后在电脑上打开 [script.dingshao.cn](https://script.dingshao.cn) 扫码授权。
2. 切换到“部署”页，找到“Package Registry”，复制到 `.npmrc` 文件中。注意当前包名在部署时并无作用，此配置则决定了实际部署的频道。
3. 执行 `npm publish` 完成发布（模板中已将 `publishConfig.regisry` 配置为了盯梢脚本专有地址）。

## 关键内容

当前模板中很多内容可以根据需要进行修改，不过也有特定的配置是部署脚本必须的。

### package.json

```jsonc
{
  // 发布配置
  "publishConfig": {
    "registry": "https://script.dingshao.cn/registry/"
  },
  // 发布内容
  "files": ["bundled-script.js"],
  // 部署脚本入口，由 dss build 命令构建。
  "main": "bundled-script.js",
  "digshare": {
    // 运行时，当前仅支持 nodejs14。
    "runtime": "nodejs14",
    // 定时执行 cron 表达式，6 位，建议不要扎堆整点执行。
    "cron": "0 0 0 * * ?"
  }
}
```

### 构建工作流

核心工作流是 `dss build`，其中 `dss` 是 `@digshare/script` 包提供的命令行工具。

在当前模板中，构建分为两步：

1. `tsc --project ./src` 将 TypeScript 构建为 ES Module 的 JavaScript。
2. `dss build --input ./bld/script.js` 将 TypeScript 构建的脚本进行打包。

如果不使用 TypeScript，可以直接使用 `dss build` 构建 ES Module 的 JavaScript。
