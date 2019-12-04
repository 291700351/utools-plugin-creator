utools.onPluginReady(function () {
    window.create = function (pluginName, pluginVersion, author, homePage) {
        //js代码
        const tl = require('art-template');//引入ejs
        let path = require("path");
        const fs = require('fs');
        fs.readFile(path.join(__dirname, 'templates/temp_plugin.json'), function (err, data) {

            const ret = tl.render(data.toString(), {

                //对应{{ name }}
                name: pluginName,
                //对应{{ age }}
                version: pluginVersion,
                //对应{{ province }}
                author: author,

                page: homePage,

            });
            let desktop = utools.getPath('desktop');
            let projectRoot = path.join(desktop, pluginName);
            let pageDir = path.join(projectRoot, "pages");
            //创建相关目录
            fs.mkdirSync(projectRoot);
            fs.mkdirSync(pageDir);
            //复制index.html
            let readBuffer = fs.readFileSync(path.join(__dirname, "templates/index.html"));
            fs.writeFileSync(path.join(pageDir, "index.html"), readBuffer.toString());
            //复制d.ts文件
            let readTsBuffer = fs.readFileSync(path.join(__dirname, "templates/Utools.d.ts"));
            fs.writeFileSync(path.join(projectRoot, "Utools.d.ts"), readTsBuffer.toString());
            //复制preload.js
            let readPreBuffer = fs.readFileSync(path.join(__dirname, "templates/preload.js"));
            fs.writeFileSync(path.join(projectRoot, "preload.js"), readPreBuffer.toString());
            //模板引擎生成plugin.json
            fs.writeFileSync(path.join(projectRoot, "plugin.json"), ret);

            utools.outPlugin();
            utools.showNotification("创建插件" + pluginName + "成功", "openPlugin", true)

        });

    };

    // window.exports = {
    //     "openPlugin": { // 注意：键对应的是plugin.json中的features.code
    //         mode: "none",  // 用于无需UI显示，执行一些简单的代码
    //         args: {
    //             // 进入插件时调用
    //             enter: (action: { code, type, payload; }) => {
    //                 alert("code = " + code)
    //
    //                 // window.utools.hideMainWindow();
    //                 // do some thing
    //                 // window.utools.outPlugin();
    //             }
    //         }
    //     }
    // };
});


utools.onPluginEnter(function (code, type, payload) {


});
