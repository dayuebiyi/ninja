const child = require('child_process')
const iconv = require('iconv-lite')
const exec = child.exec
var shell = require('shelljs');


function viewProcessMessage(name, cb) {
    let cmd = process.platform === 'win32' ? 'tasklist' : 'ps aux'
    exec(cmd, { encoding: "gbk" }, function(err, stdout, stderr) {
        if (err) {
            return console.error(err)
        }
        let arr_process = iconv.decode(stdout, "GBK").split('\n');
        return arr_process.find(item => item.indexOf('POWERPNT.EXE')) == -1? false: true;
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

function openfile(){
	shell.exec("D://demo/1.pps"); //打开pps文件
	let timer = setInterval(() => { // 5秒检查一次
		if(viewProcessMessage()){
			console.log("pps正在播放")
		}else {
			clearInterval(timer);
			console.log("pps已播放完")
		}
	}, 5000)
}

openfile();