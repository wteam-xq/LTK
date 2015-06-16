/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-6
 * Time: 下午9:31
 * To change this template use File | Settings | File Templates.
 */
var systemTime = null;
//供选择的武将列表
var role_one = null;
var role_two = null;
var start_layer = null;
//信息提示文本
var info_tip = null;
//离边界距离
var BODERSPACE = 3;
//手牌区域高度
var FILEDHEIGHT = 104;
//本方武将右上角锚点
var self_heroX = 0;
var self_heroY = 0;
//AI 身份
var enemy_roleIco = null;


var startGameLayer = cc.LayerColor.extend({
    blackShade:null,
    init:function(){
        this._super();
        this.setColor(new cc.Color3B(12,16,33));
        var size = cc.Director.getInstance().getWinSize();

        //初始化黑色遮罩
        /*this.blackShade = cc.LayerColor.create(new cc.Color3B(0,0,0),size.width,size.height);
        this.blackShade.setOpacity(150);
        this.blackShade.setVisible(false);*/
        this.blackShade = new chooseShade();
        this.blackShade.init();

        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_battleBg_plist, s_battleBg_png);
        cache.addSpriteFrames(s_role_plist, s_role_png);
        var battbleBg = cc.Sprite.createWithSpriteFrameName('battleBackgroup.png');
        battbleBg.setAnchorPoint(Anchor.LEFT_BOTTOM);
        //（问题：Layer类无法设置锚点位置）
        var exit_startGame = cc.MenuItemImage.create(s_exitD, s_exitC, this.exitStartGame, this);
//        exit_startGame.setScale(0.7,0.7);
        var esg_width = exit_startGame.getContentSize().width/2;
        var esg_height = exit_startGame.getContentSize().height/2;
        var exit_menu = cc.Menu.create(exit_startGame);
        exit_menu.setAnchorPoint(Anchor.RIGHT_TOP);
        exit_menu.setPosition(cc.p(size.width - esg_width,size.height - esg_height));

        var surplusC_layer = cc.LayerColor.create(new cc.Color3B(0,0,0));
        var surplusC_ico = cc.Sprite.createWithSpriteFrameName('cardpile.png');
        surplusC_ico.setAnchorPoint(Anchor.LEFT_BOTTOM);
        surplusC_ico.setPosition(cc.p(0,0));
        var font_width = surplusC_ico.getContentSize().width;
        var font_height = surplusC_ico.getContentSize().height;
        var surplusC_font = cc.LabelTTF.create("104", "Impact", 18, cc.size(font_width, font_height), cc.TEXT_ALIGNMENT_CENTER);
        surplusC_font.setAnchorPoint(Anchor.LEFT_BOTTOM);
        surplusC_font.setPosition(cc.p(font_width,0));
        surplusC_layer.addChild(surplusC_ico,0);
        surplusC_layer.addChild(surplusC_font,0);
        var surplusCLW = size.width - 2*font_width;
        var surplusCLH = size.height - font_height - 2*esg_height - 3;
        surplusC_layer.setPosition(cc.p(surplusCLW,surplusCLH));

        var enemyHeros_sprite = cc.Sprite.createWithSpriteFrameName('enemyHeros.png');
        var selfHeros_sprite = cc.Sprite.createWithSpriteFrameName('selfHeros.png');
        enemyHeros_sprite.setAnchorPoint(Anchor.LEFT_TOP);
        enemyHeros_sprite.setPosition(cc.p(0 + BODERSPACE,size.height - BODERSPACE));
        selfHeros_sprite.setAnchorPoint(Anchor.RIGHT_TOP);
        selfHeros_sprite.setPosition(cc.p(size.width - BODERSPACE,surplusCLH - BODERSPACE));
        self_heroX = size.width - BODERSPACE;
        self_heroY = surplusCLH - BODERSPACE;

        //角色图片，（问题：给精灵添加子类后锚点无法改变）
        role_one = new roleSprite();
        role_two = new roleSprite();
        role_one.setPosition(cc.p(size.width/3,(size.height*2)/3));
        var role_width = role_one.getContentSize().width;
        role_two.setPosition(cc.p(size.width/3 + role_width + BODERSPACE,(size.height*2)/3));
        //身份随机分配
        var random_num = Math.random();
        if(random_num >= 0.5){
            role_one.role_value = 'Monarch';
            role_two.role_value = 'turnCoat';
        }else{
            role_one.role_value = 'turnCoat';
            role_two.role_value = 'Monarch';
        }
        this.addChild(role_one,2);
        this.addChild(role_two,2);

        systemTime = cc.LabelTTF.create("00:00", "Impact", 14, cc.size(font_width, font_height), cc.TEXT_ALIGNMENT_CENTER);
        systemTime.setPosition(BODERSPACE + 14,FILEDHEIGHT);
        systemTime.schedule(this.updateTime,1/6);

        this.addChild(battbleBg,0);
        this.addChild(exit_menu,2);
        this.addChild(surplusC_layer,1);
        this.addChild(enemyHeros_sprite,2);
        this.addChild(selfHeros_sprite,2);
        this.addChild(systemTime,2);
        this.addChild(this.blackShade,6);
    },
    exitStartGame:function(){
        //黑色透明遮罩效果
        this.blackShade.setVisible(true);
        this.blackShade.setTouchEnabled(true);
    },
    updateTime:function(){
        var systemDate = new Date();
        var current_hour = systemDate.getHours();
        var current_minute = systemDate.getMinutes();
        if(current_hour < 10){
            current_hour = '0' + current_hour;
        }
        if(current_minute < 10){
            current_minute = '0' + current_minute;
        }
        systemTime.setString(current_hour + ":" + current_minute);
    }
});

//遮罩层
var chooseShade = cc.LayerColor.extend({
    transition_scene:null,
    init:function(){
        this.transition_scene = new StartScene();
        var size = cc.Director.getInstance().getWinSize();
        this.setColor(new cc.Color3B(0,0,0));
        this.changeWidthAndHeight(size.width,size.height);
        this.setOpacity(200);
        this.setVisible(false);
        //警告提醒框
        var dialog_fram = cc.Sprite.create(dialogFram);
        var submit_item = cc.MenuItemImage.create(s_certain_cli, s_certain_def, this.sureExit, this);
        var cancel_item = cc.MenuItemImage.create(s_cancel_cli, s_cancel_def, this.cancelExit, this);
        var menu = cc.Menu.create(submit_item, cancel_item);
        menu.setAnchorPoint(Anchor.LEFT_BOTTOM);
        menu.setScale(0.6,0.6);
        var menu_pw = dialog_fram.getContentSize().width;
        var menu_ph = dialog_fram.getContentSize().height;
        menu.setPosition(cc.p(menu_pw/2,menu_ph/3));
        menu.alignItemsHorizontallyWithPadding(40);
        var font_width = submit_item.getContentSize().width/2;
        var font_height = submit_item.getContentSize().height/2;
        var exit_warn = cc.LabelTTF.create("确定退出游戏？", "Impact", 16, cc.size(font_width, font_height), cc.TEXT_ALIGNMENT_CENTER);
        exit_warn.setPosition(cc.p(menu_pw/2,(menu_ph*2)/3));
        dialog_fram.addChild(menu, 4);
        dialog_fram.addChild(exit_warn, 4);
        dialog_fram.setPosition(cc.p(size.width/2,(size.height*4)/7));
        this.addChild(dialog_fram,1);

    },
    onEnter:function(){
        this._super();
    },
    onTouchesEnded:function (){
        this.setVisible(false);
        this.setTouchEnabled(false);
    },
    sureExit:function(){
       this.transition_scene.onTransition('startG_mainF');
    },
    cancelExit:function(){
        this.onTouchesEnded();
    }
});

//身份(主公、内奸、反贼)精灵，其中boss模式:主公vs反贼， 而武将模式中：主公vs内奸
var roleSprite = cc.Sprite.extend({
    role_value:null,
    ctor:function(){
        this._super();
        this.initWithSpriteFrameName('role.png');
        this.setScale(0.8,0.8);
        //给精灵添加事件
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, 0, true);
    },
    //判断触摸点是否在图片的区域上
    containsTouchLocation:function (touch) {
        //获取触摸点位置
        var getPoint = touch.getLocation();
        //获取图片区域尺寸
        var contentSize  =  this.getContentSize();
        //定义点击的有效区域
        var myRect = cc.rect(0, 0, contentSize.width, contentSize.height);
        myRect.origin.x += this.getPosition().x - contentSize.width/2;
        myRect.origin.y += this.getPosition().y - contentSize.height/2;
        //判断点击是否在区域上
        return cc.Rect.CCRectContainsPoint(myRect, getPoint);
    },
    //触摸完
    onTouchBegan:function (touch){
        if (this.containsTouchLocation(touch)){
            //禁止点击另一角色牌（或禁止所有页面事件，1秒后进入下一阶段）
           cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_one);
           cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_two);
            //动画效果
            var actionTo = cc.SkewTo.create(1, 0, 2);
            var rotateTo = cc.RotateTo.create(1, 61.0);
            var actionScaleTo = cc.ScaleTo.create(1, -0.44, 0.47);
            var actionToBack = cc.SkewTo.create(1, 0, 0);
            var rotateToBack = cc.RotateTo.create(1, 0);
            var actionScaleToBack = cc.ScaleTo.create(1, 1.0, 1.0);
            if(this.role_value == 'Monarch'){
                this.initWithSpriteFrameName('monarch.png');
                //设置AI身份
                enemy_roleIco = cc.Sprite.createWithSpriteFrameName('turnCoat.png');
            }else{
                this.initWithSpriteFrameName('turnCoat.png');
                enemy_roleIco = cc.Sprite.createWithSpriteFrameName('monarch.png');
            }
            this.runAction(cc.Sequence.create(actionTo, actionToBack));
            this.runAction(cc.Sequence.create(rotateTo, rotateToBack));
            this.runAction(cc.Sequence.create(actionScaleTo, actionScaleToBack));
            //两秒后重绘战场
            this.scheduleOnce(this.toTransition, 2);

        }
    },
    toTransition:function(){
        role_one.setVisible(false);
        role_two.setVisible(false);
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_one);
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_two);
        var change_scene = new StartScene();
        change_scene.onChooseHeroScene(this.role_value);
    }
    /*//刚触摸瞬间
    onTouchBegan:function (touch, event) {
        if (!this.containsTouchLocation(touch)) return false;
        return true;
    },
    //触摸移动
    onTouchMoved:function (touch, event) {
        cc.log("onTouchMoved");
        var touchPoint = touch.getLocation();
        this.setPositionX(touchPoint.x);  //设置X轴位置等于触摸的x位置
    }*/
});

//开始游戏场景
var StartGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        start_layer = new startGameLayer();
        start_layer.init();
        this.addChild(start_layer,0);

        /*//直接到选将阶段（测试）
        role_one.setVisible(false);
        role_two.setVisible(false);
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_one);
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(role_two);
        var change_scene = new StartScene();
        change_scene.onChooseHeroScene(role_one.role_value);

        enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg03.png');
        if(role_one.role_value == 'Monarch'){
            //设置AI身份
            enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg06.png');
        }*/

        if(window.localStorage){
            var musicPlay = (window.localStorage.getItem('musicPlay') == 'true');
            var music_vol = parseFloat(window.localStorage.getItem('music_vol'));
            if(musicPlay){
                //播放背景音乐
                cc.AudioEngine.getInstance().playMusic(s_backgroundMusic,true);
                cc.AudioEngine.getInstance().setMusicVolume(music_vol);
            }
        }else{
            if(g_musicPlay){
                //播放背景音乐
                cc.AudioEngine.getInstance().setMusicVolume(g_music_vol);
                cc.AudioEngine.getInstance().playMusic(s_backgroundMusic,true);
            }
        }

    }
});
