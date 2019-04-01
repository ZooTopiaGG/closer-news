const qcdn = require('@q/qcdn');
// import * as qcdn from '@q/qcdn';
const path = require('path');
const fs = require('fs');

// 项目构建后的目录
const rootDir = 'public';
// 上传cdn后的输出目录
const outputDir = 'output';
// cdn上传时的配置参数[可选]
const cdnOpts = {
  // https: false, //是否使用https,默认false
  // force: false, //是否忽略错误,默认false
  // keepName: false, //是否保留文件名,默认false
  // all: false, //是否忽略隐藏文件,默认false
  // directory: false, //返回结果中的相对路径参照值
  // domains: false, //自定义cdn域名,值需为数组,会自动进行散列
  // image: false, //图片相关参数
  // static: false //静态资源相关参数
}

//读取文件存储数组
let rootFiles = {
  html: [],
  js: [],
  css: [],
  imgs: [],
  other: []
}

// 绝对路径
const rootPath = path.resolve(__dirname, rootDir);
const outputPath = path.resolve(__dirname, outputDir);

let init = () => {
  if (!fs.existsSync(rootPath)) {
    console.error(`ERR! The path "${rootPath}" is not exist!`);
    return
  }
  // 新建输出目录
  if (fs.existsSync(outputPath)) {
    rmdirSync(outputPath);
  }
  fs.mkdirSync(outputPath);

  readPath(rootPath);
  uploadFiles('imgs', []).then(() => uploadSources())
}

// 删除目录
let rmdirSync = (() => {
  let iterator = (url, dirs) => {
    let stat = fs.statSync(url);
    if (stat.isDirectory()) {
      dirs.unshift(url); //收集目录
      inner(url, dirs);
    } else if (stat.isFile()) {
      fs.unlinkSync(url); //直接删除文件
    }
  }

  let inner = (path, dirs) => {
    let arr = fs.readdirSync(path);
    for (let i = 0, el; el = arr[i++];) {
      iterator(path + "/" + el, dirs);
    }
  }
  return (dir, cb = () => {}) => {
    let dirs = [];

    try {
      iterator(dir, dirs);
      for (let i = 0, el; el = dirs[i++];) {
        fs.rmdirSync(el); //一次性删除所有收集到的目录
      }
      cb()
    } catch (e) { //如果文件或目录本来就不存在，fs.statSync会报错，不过我们还是当成没有异常发生
      e.code === "ENOENT" ? cb() : cb(e);
    }
  }
})();

let uploadSources = () => {
  console.log(`\n>>>>>>>>>>>>>>>>>>>> Start upload files to cdn <<<<<<<<<<<<<<<<<<<<\n`)
  Promise.all([uploadFiles('js', []), uploadFiles('css', ['imgs'])]).then(data => {
    console.log(`\n>>>>>>>>>>>>>>>>>>>> All files has been uploaded <<<<<<<<<<<<<<<<<<<<\n`)
    let desHtml = readFile('html', ['js', 'imgs', 'css']);
    console.log(`#################### Success ####################`)
    console.log(`The output html files:`)
    desHtml.forEach(file => console.log(`- ${file}`))
  }).catch(xhr => {
    console.error(xhr)
  })
}

let uploadFiles = (type, replaceType) => {
  let desFiles = readFile(type, replaceType);
  let logStr = `*** Upload [${type}] end ***`;
  console.log(`*** Upload [${type}] start ***`)
  console.time(logStr);
  return qcdn.upload(desFiles, cdnOpts).then(data => {
    rootFiles[type] = data
    console.timeEnd(logStr);
  })
}

let readFile = (type, replaceSource) => {
  let desPathArr = [],
      logStr = `<<< Output [${type}] end <<<`;
  console.log(`>>> Output [${type}] start >>>`);
  console.time(logStr);
  rootFiles[type].forEach(file => {
    console.log(`- ${file}`);
    let encoding = /(\.jpg|\.png|\.gif|\.webp)$/.test(file) ? null : 'utf-8';
    let data = fs.readFileSync(file, {encoding: encoding});
    let desPath = path.join(outputPath, file.split(rootPath)[1]);
    let relativePath = path.dirname(desPath);
    replaceSource.forEach(source => data = replacePath(relativePath,data,type,source))
    createFolder(desPath);
    fs.writeFileSync(desPath, data)
    desPathArr.push(desPath);
  })
  console.timeEnd(logStr)
  console.log('')
  return desPathArr;
}

let createFolder = to => { //文件写入
  let sep = path.sep,
      folders = path.dirname(to).split(sep),
      p = '';
  while (folders.length) {
    p += folders.shift() + sep;
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p);
    }
  }
};

let replacePath = (relativePath,data,type,source) => {
  let exp = null;
  switch (source) {
    case 'js': 
      exp = /(<script[^>]+src=['"])([^'"]+)(['"]+)/g;
      break;
    case 'css':
      exp = /(<link[^>]+href=['"])([^'"]+)(['"]+)/g;
      break;
    case 'imgs':
      exp = type == 'html'? /(<img[^>]+src=['"])([^'"]+)(['"]+)/g : /(url\()([^()]+)(\))/g;
      break;
    default: break;
  }
  if (!exp) return data;
  return data.replace(exp, ($0, $1, $2, $3) => {
    let filePath = $2.split('?')[0];
    let absolutePath = path.resolve(relativePath,filePath);
    if (/http(s)?:\/\//g.test($2)) return $0;
    if (rootFiles[source][absolutePath]) {
      return $1 + rootFiles[source][absolutePath] + $3;
    } else {
      return $0;
    }
  })
}

// 保存文件路径
let savePath = fileName => {
  let extName = path.extname(fileName).substr(1),
    arr = null;
  switch (extName) {
    case 'gif':
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'webp':
      arr = 'imgs';
      break;
    case 'html':
      arr = 'html';
      break;
    case 'js':
      arr = 'js';
      break;
    case 'css':
      arr = 'css';
      break;
    default:
      arr = 'other';
      break;
  }
  rootFiles[arr].push(fileName) //.split(rootPath)[1])
};
//获取文件数组
let readPath = dirPath =>  {
  let files = fs.readdirSync(dirPath);
  files.forEach(filename => {
    let subPath = path.join(dirPath, filename);
    let stats = fs.statSync(subPath);
    if (stats.isFile()) {
      console.log(`- ${subPath}`);
      savePath(subPath);
    } else if (stats.isDirectory()) {
      readPath(subPath);
    }
  });
};

init();