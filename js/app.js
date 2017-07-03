// 这是我们的玩家要躲避的敌人 
var cw = 505;
var ch = 606;
var Enemy = function(x,y) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.x = x;
    this.y = y;
    this.sprite = gameConfig.enemyImg;

    this.speed = getRandomNum(localStorage.level*20, localStorage.level*20+150)*1;
};


// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    if (this.x > cw) {
        this.x = 0;
    }
    this.x += this.speed*dt;
    this.handle();
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.handle = function(){
    if (player.y === this.y) {
        if (this.x+40>=player.x-40 && this.x-40<=player.x+40) {
            status = 'failed';
        }
    }
}

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function(x, y){
    this.x = x;
    this.y = y;
    if (localStorage.userImg || localStorage.userImg != '') {
        this.sprite = localStorage.userImg;
    }else{
        this.sprite = 'images/char-princess-girl.png';
    }

};
Player.prototype = {
    update: function(x,y){
        x = x || 0;
        y = y || 0;
        if (x>0) {
            x = this.x + x >= cw ? 0 : x;
        }
        if (x<0) {
            x = this.x + x <= 0 ? 0 : x;
        }
        if (y<0) {
            // y = this.y + y < -25 ? 0 : y;
        }
        if (y>0) {
            y = this.y + y > 400 ? 0 : y;
        }
        this.x = this.x + x;
        this.y = this.y + y;
    },
    render: function(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        // ctx.putImageData(saveImgData,205,400);
    },
    handleInput: function(key){
        switch (key){
            case 'up':
            this.update(0, -85);
            if (this.y < -25) {
                // 这里小于-25既表明已经过关，可进入下一关，localstorage.level+1 同时 this.y 变为初始状态
                this.y = 400;
                localStorage.level = localStorage.level*1+1;
                for (var i = 0; i < allEnemies.length; i++) {
                    allEnemies[i]['speed'] = getRandomNum(localStorage.level*20, localStorage.level*20+150)*1;
                }
            }
            break;
            case 'down':
            this.update(0, 85);
            break;
            case 'left':
            this.update(-100, 0);
            break;
            case 'right':
            this.update(100, 0);
            break;
        }
    }
}

// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面 
var player = new Player(gameConfig.player.x, gameConfig.player.y);
var allEnemies = [];
for (var i = 0; i < gameConfig.enemy.length; i++) {
    allEnemies.push(new Enemy(gameConfig.enemy[i].x,gameConfig.enemy[i].y))
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// 这里为范围随机数
function getRandomNum(a,b){
      return b + Math.round(Math.random() * (a - b));
}