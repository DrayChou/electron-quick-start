var app = require('app'); // Module to control application life. 控制应用生命周期的模块。
var globalShortcut = require('global-shortcut'); // 模块可以便捷的为您设置(注册/注销)各种自定义操作的快捷键.
var ipc = require('ipc');
var shell = require('shell');
var Menu = require('menu');
var clipboard = require('clipboard');
var BrowserWindow = require('browser-window'); // Module to create native browser window. 创建原生浏览器窗口的模块
var domain = require('./domain.js');

// Report crashes to our server. 给我们的服务器发送异常报告。
require('crash-reporter').start();

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，window 会被自动地关闭
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var onlineStatusWindow = null;

// 当所有窗口被关闭了，退出。
// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

//窗口失去焦点
app.on('browser-window-blur', function() {
    console.log('browser-window-blur');
})

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    // 创建浏览器窗口。
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    // 加载应用的 index.html
    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    onlineStatusWindow = new BrowserWindow({
        width: 0,
        height: 0,
        show: false
    });
    onlineStatusWindow.loadUrl('file://' + __dirname + '/online-status.html');

    // Register a 'ctrl+v' shortcut listener.
    var ret = globalShortcut.register('ctrl+v', function() {
        console.log('ctrl+v is pressed');
        shell.beep();
        // shell.showItemInFolder(__dirname);
        // shell.openExternal('http://idc.wf');

        var image = clipboard.readImage();
        if (image.isEmpty()) {
            console.log('no pic');
        } else {
            console.log('pic size w:');
            console.log(image.getSize());
            console.log(image.toDataUrl());

            mainWindow.webContents.send('new-pic', image.toDataUrl());
        }
    })

    if (!ret) {
        console.log('registration failed');
    }

    // Check whether a shortcut is registered.
    console.log(globalShortcut.isRegistered('ctrl+v'));

    // 打开开发工具
    // Open the DevTools.
    mainWindow.openDevTools();

    // 当 window 被关闭，这个事件会被发出
    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});

app.on('will-quit', function() {
    // Unregister a shortcut.
    globalShortcut.unregister('ctrl+v');

    // Unregister all shortcuts.
    globalShortcut.unregisterAll();
});

// 在线状态时间监听
ipc.on('online-status-changed', function(event, status) {
    console.log(status);
});

// 检查域名
ipc.on('domain-check-button', function(event, message) {
    console.log(message);

    if (message == 'click') {
        domain.checkDomains("dc", function(res) {
            console.log('check domain dc');
            mainWindow.webContents.send('domain-check-result', res);
        })
    }
});

//var dockMenu = Menu.buildFromTemplate([{
//    label: 'New Window',
//    click: function() {
//        console.log('New Window');
//    }
//}, {
//    label: 'New Window with Settings',
//    submenu: [{
//        label: 'Basic'
//    }, {
//        label: 'Pro'
//    }]
//}, {
//    label: 'New Command...'
//}]);
//app.dock.setMenu(dockMenu);
