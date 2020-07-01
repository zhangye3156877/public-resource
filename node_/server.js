const Koa = require('koa');
const Router = require('koa-router')
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const fs = require('fs');
const path = require('path');
const app = new Koa();
const router = new Router();
app.use(cors());
app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 200*1024*1024 
    }
}));

router.get('/', async (ctx) => {
  ctx.body = 'hello world';
})
router.get('/getimg', async (ctx) => {
  const filePath = path.join(__dirname, 'public/c.jpg');
  const stream = fs.createReadStream(filePath);
  ctx.type = 'image/jpeg';
  ctx.body = stream;
  //stream.pipe(ctx.body);
})
router.post('/test', async (ctx) => {
  ctx.body = 'test success'
})
router.post('/uploadfile', async (ctx, next) => {
  const file = ctx.request.files.file;
  const file2 = ctx.request.files.file2;
  console.log(file2.type)
  const reader = fs.createReadStream(file2.path);
  reader.on('data', (chunk) => {
  console.log('读取文件数据:', chunk);
  })
  //let filePath = path.join(__dirname, 'public') + `/${file2.name}`;
  let filePath = path.join(__dirname, 'public') + `/z.jpeg`;
  const upStream = fs.createWriteStream(filePath);
  reader.pipe(upStream);

  //return ctx.body = ctx.request.files;
  // fs.readFile(file.path, (err, data) => {
  //   console.log(data);
  // })
  // fs.readFile(file2.path, (err, data) => {
  //   console.log(data);
  // })
  ctx.body = 'ok'
});

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(7002)