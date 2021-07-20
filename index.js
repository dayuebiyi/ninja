const express = require('express')
const app = express()
const port = 8080

const child = require('child_process')
const iconv = require('iconv-lite')
const exec = child.exec
var shell = require('shelljs');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/open', (req, res) => {
    openfile(function() {
        res.send('ppt播放完了')
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})





function viewProcessMessage(name, cb) {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(cmd, { encoding: "gbk" }, function(err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        let arr_process = iconv.decode(stdout, "GBK").split('\n');
        return arr_process.find(item => item.indexOf('POWERPNT.EXE')) == -1 ? false : true;
        iconv.decode(stdout, "GBK").split('\n').filter((line) => {
            let processMessage = line.trim().split(/\s+/);
            console.log(processMessage)
            let processName = processMessage[0] //processMessage[0]进程名称 ， processMessage[1]进程id
            if (processName === name) {
                return cb(processMessage[1])
            }
        })
    })
}

function openfile(cb) {
    shell.exec("D://demo/1.pps"); //打开pps文件
    let timer = setInterval(() => { // 5秒检查一次
        if (viewProcessMessage()) {
            console.log("pps正在播放")
        } else {
            clearInterval(timer);
            cb();
        }
    }, 5000)
}
