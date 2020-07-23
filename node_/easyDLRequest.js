const axios = require('axios');
const http = require('http');
const path = require('path');
const fs = require('fs');


// axios({
//   method: 'post',
//   url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=tfUL4jB4klTSR7BMa7GpHoqL&client_secret=ax6TOezXXo4lqMI4vgCGH9WtqfD25pz4',

// })
// .then((res) =>{
//   console.log(res);
// })
// .catch((error) => {
//   if (error.response) {
//     // 请求已发出，但服务器响应的状态码不在 2xx 范围内
//     console.log(error.response.data);
//     console.log(error.response.status);
//     console.log(error.response.headers);
//   } else {
//     // Something happened in setting up the request that triggered an Error
//     console.log('Error', error.message);
//   }
//   // console.log(error.config);
// })
// const data = {
//   refresh_token:
//     '25.575d117634836a425014974719634f86.315360000.1898660462.282335-18658802',
//   expires_in: 2592000,
//   session_key:
//     '9mzdA8lCtG6YYAnvvDEIZvedZr7rGrbNWOtXdookQuMOgOxhbmD7pH5D5nRljGOxW3IOcZ40b4a+ps9kquWmudIphBw2KQ==',
//   access_token:
//     '24.8c78e189a3e74219d8750da4be4ac4d5.2592000.1585892462.282335-18658802',
//   scope:
//     'ai_custom_kztest public brain_all_scope easydl_mgr easydl_retail_mgr ai_custom_retail_image_stitch easydl_pro_mgr wise_adapt lebo_resource_base lightservice_public hetu_basic lightcms_map_poi kaidian_kaidian ApsMisTest_Test权限 vis-classify_flower lpq_开放 cop_helloScope ApsMis_fangdi_permission smartapp_snsapi_base iop_autocar oauth_tp_app smartapp_smart_game_openapi oauth_sessionkey smartapp_swanid_verify smartapp_opensource_openapi smartapp_opensource_recapi fake_face_detect_开放Scope vis-ocr_虚拟人物助理 idl-video_虚拟人物助理',
//   session_secret: '314dfe86a88ca257638d07f2f9e5b0dc'
// }

function handlePost(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Content-type', 'application/json')
  res.end(JSON.stringify({
    message: 'ok'
  }));
}
function handleUpload(req, res) {
  console.log(req.method);
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type')
  res.setHeader('Content-type', 'application/json')
  if (req.method === 'OPTIONS') {
    return res.end(JSON.stringify({
      message: 'options-allowed'
    }));
  }
  if (req.method === 'POST') {
    console.log('文件处理');
    let data = '';
    req.on('data', (c) => {
      data += c;
    })
    req.on('end', () => {
      console.log('文件读取完毕');
      fs.writeFile('./public/test.jpg', data, 'binary', (err) => {
        if (err) return console.log(err)
        console.log('写入图片')
      })
      res.end(JSON.stringify({
        code: 200
      }));
    })
    //console.log(req.headers)
    // res.end(JSON.stringify({
    //   code: 200
    // }));


  }

}
const server = http.createServer();

server.on('request', (req, res) => {
  //console.log(req.url);

  if (req.url === '/validateImage') {
    return handlePost(req, res);
  }
  if (req.url === '/uploadImage') {
    return handleUpload(req, res);
  }
})

server.listen(3000)


// axios({
//   method: 'post',
//   url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/kztest?access_token=24.8c78e189a3e74219d8750da4be4ac4d5.2592000.1585892462.282335-18658802',
//   headers: {
//     'Content-type': 'application/json'
//   },
//   data: {
//     'image': 'xxx'
//   }
// })
// .then((res) => {
//   console.log(res.data)
// })
// .catch((error) => {
//   if (error.response) {
//     console.log(error.response.status)
//     console.log(error.response.data)
//   } else {
//     console.log(error.message)
//   }
// })