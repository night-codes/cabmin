# Cabmin for OrangeBox (cabmin)
Simple control panel for [Node.js](http://nodejs.org) based on [OrangeBox](https://github.com/mirrr/orangebox) 
![Cabmin screenshot](http://msrv.su/files/screen.png)
![Cabmin screenshot 2](http://msrv.su/files/screen2.png) 
Lightweight  web application framework on clusters with file server.
   
    

## How To Install   
```bash
npm install cabmin
```

   


## Getting Started


**index.js**
```js
var app    = require('orangebox').app();
var cabmin = require('cabmin');

var users = {
    admin: {
        userpic: 17,
        hash:  '9sg87sf68.....' //password hash 
    }
};

app.use(cabmin.init({
    title    : 'mysite',
    mainPage : '/news',
    path     : __dirname + '/controllers',
    views    : __dirname + '/views',
    users    : users
}));

app.get('/', function (req, res) {
  res.send('This is site frontend');
});
app.listen(8080);
```
   
*For hash generation you can use script:*
   
**password.js**
```js
var cabmin = require('cabmin');
console.log(cabmin.hash('password123'));
```


 
**/controllers/news.js**   
   
```js
module.exports.info = {
    "news": {
        title: 'News panel',
        method: newsRender,
        // dropmenu: true,
        order: 1,
        count: 50
    }
};

function newsRender (req, res, next) {
    res.render({data: 'This is backend', test: 'Test, test'}, 'newsTPL');
    next();
}
```
   
**/views/newsTPL.html**

```html
<div><img src="https://dl.dropboxusercontent.com/u/68595887/a/t.png" /></div>
<div class="wow"><i>{{ data }}</i></div>
<div class="num"><b>{{ test }}</b></div>
```
   
   
## Examples
Coming soon...
   
   
## People

Author and developer is [Oleksiy Chechel](https://github.com/mirrr)   
   


## License
   
MIT License   
   
Copyright (C) 2014 Oleksiy Chechel (alex.mirrr@gmail.com)   
   
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:   
   
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.   
   
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
