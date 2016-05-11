# Cabmin
Simple control panel for [Node.js](http://nodejs.org) based on [OrangeBox](https://github.com/mirrr/orangebox) 
![Cabmin screenshot](http://msrv.su/files/screen.png)
![Cabmin screenshot 2](http://msrv.su/files/screen2.png) 
Lightweight  web application framework on clusters with file server.
   
    

## How To Install   
```bash
npm install cabmin
```

   


## Getting Started

```js
var app    = require('orangebox').app();
var cabmin = require('cabmin').init({
    title    : 'mysite',
    mainPage : '/news',
    path     : __dirname + '/controllers',
    views    : __dirname + '/views',
    users    : {
        admin: {
            userpic: 17,
            hash:  '9sg87sf68.....' //password hash 
        }
    }
});

app.use(cabmin);

app.get('/', function (req, res) {
  res.send('This is site frontend');
});

app.listen(8080);
```
   
*For hash generation you can use script:*
```js
var cabmin = require('cabmin');
console.log(cabmin.hash('password123'));
```

## Create section in cabmin
 
**/controllers/news.js**   
   
```js
module.exports = function(user) { 
    return {
        "news": {
            title: 'News panel',
            method: function(req, res, next) {
                res.render('newsTPL', {data:'This is backend', test:'Check Me'});
                next();
            }
        }
    };
};
```
   
**/views/newsTPL.html**

```html
<div class="wow">
    <img src="http://msrv.su/files/test.png" />
    <h3>{{ data }}</h3>
    <input type="checkbox" id="c" checked /> {{ test }}
</div>
```
   
**Result:**
![Cabmin screenshot](http://msrv.su/files/totem.png)

## Groups section in cabmin
For groupings sections, use the following options in the controllers: submenu, subOrder.  
When submenu is name group, subOrder is order in menu.

**/controllers/admins.js**  
   
```js
module.exports = function(user) {
    return {
        "admin": {
            title: 'Administration',
            submenu : 'Users',
            order: 2,
            method: function(req, res, next) {
                res.render('adminTPL', {});
                next();
            }
        }
    };
};
```

**/views/adminTPL.html**

```html
<h3>Here, about the administration</h3>
```

**/controllers/users.js**  
   
```js
module.exports = function(user) {
    return {
        "users": {
            title: 'Users',
            submenu : 'Users',
            order: 1,
            method: function(req, res, next) {
                res.render('userTPL', {});
                next();
            }
        }
    };
};
```

**/views/userTPL.html**

```html
<h3>Here, about the users</h3>
```

**Result:**
![Cabmin screenshot](https://raw.githubusercontent.com/mirrr/cabmin/master/cb-public/img/submenu.jpg)

## Examples
Coming soon...
   
   
## People

Author and developer is [Oleksiy Chechel](https://github.com/mirrr), and developer [Igor Stcherbina](https://github.com/eagle7410)    
   


## License
   
MIT License   
   
Copyright (C) 2014 Oleksiy Chechel (alex.mirrr@gmail.com)   
   
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:   
   
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.   
   
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
