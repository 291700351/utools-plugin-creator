const fs = require('fs');
const tl = require('art-template');//引入ejs
const path = require("path");

function mkdir(path, listener, callback) {
    listener.onStart("开始创建路径" + path);
    fs.mkdir(path, function (err) {
        console.log("error = " + err);
        if (err) {
            listener.onFail(err);
        } else {
            listener.onSuccess("创建路径" + path + "成功");
            callback();
        }
    });

}

function copyFileSync(srcPath, targetPath, listener) {
    listener.onStart("开始复制文件" + srcPath + "到" + targetPath);
    let readBuffer = fs.readFileSync(srcPath);
    fs.writeFileSync(targetPath, readBuffer.toString());
    listener.onSuccess("文件" + srcPath + "复制成功")
}

utools.onPluginReady(function () {
    window.listener = {
        onStart: function (msg) {
            console.log(msg);
        },
        onSuccess: function (msg) {
            console.log(msg);
        },
        onFail: function (err) {
            console.log("error = " + err)
        }
    };

    window.create = function (
        pluginTemplate, listener,onFinish) {
        //创建项目根路径
        let desktop = utools.getPath('desktop');
        let projectRoot = path.join(desktop, pluginTemplate.name);
        let pageDir = path.join(projectRoot, "pages");

        mkdir(projectRoot, listener, function () {
            mkdir(pageDir, listener, function () {
                //复制文件
                //复制index.html
                const pageSrcPath = path.join(__dirname, "templates/index.html");
                const pageTargetPath = path.join(pageDir, "index.html");
                copyFileSync(pageSrcPath, pageTargetPath, listener);
                //复制preload.js
                const preloadSrcPath = path.join(__dirname, "templates/preload.js");
                const preloadTargetPath = path.join(projectRoot, "preload.js");
                copyFileSync(preloadSrcPath, preloadTargetPath, listener);
                //复制d.ts文件
                const tsSrcPath = path.join(__dirname, "templates/Utools.d.ts");
                const tsTargetPath = path.join(projectRoot, "Utools.d.ts");
                copyFileSync(tsSrcPath, tsTargetPath, listener);
                listener.onStart("开始生成plugin.json模板");
                //生成模板
                fs.readFile(path.join(__dirname, 'templates/temp_plugin.json'), function (err, data) {
                    const ret = tl.render(data.toString(), {
                        name: pluginTemplate.name,
                        desc: pluginTemplate.desc,
                        version: pluginTemplate.version,
                        author: pluginTemplate.audio,
                        page: pluginTemplate.homePage,
                    });
                    //模板引擎生成plugin.json
                    const pluginTarget = path.join(projectRoot, "plugin.json");
                    fs.writeFile(pluginTarget, ret, function (err) {
                        if (err) {
                            listener.onFail(err)
                        } else {
                            listener.onSuccess("plugin.json模板生成成功");
                            utools.showNotification("创建插件" + pluginTemplate.name + "成功", "open", true);
                            utools.outPlugin();
                            onFinish()
                        }
                    });
                });
            });
        });
    };
});

utools.onPluginEnter(function (code, type, payload) {


});
