/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-4-11
 * Time: 下午10:22
 * 三国杀场景1
 */
var Anchor = {};//精灵、图层位置
Anchor.LEFT_TOP = cc.p(0,1);
Anchor.RIGHT_TOP = cc.p(1, 1);
Anchor.RIGHT_BOTTOM = cc.p(1, 0);
Anchor.LEFT_BOTTOM = cc.p(0, 0);
Anchor.MIDDLE = cc.p(0.5, 0.5);
var TAG_MENU = 77771;


//初始页面
var IndexLayer = cc.Layer.extend({
    backgroud:null,
    menuIco:null,
    transition_scene:null,
    init:function () {
        this._super();
        this.transition_scene = new StartScene();
        var size = cc.Director.getInstance().getWinSize();
        this.backgroud = cc.Sprite.create(s_indexBackground);
        this.backgroud.setAnchorPoint(Anchor.LEFT_BOTTOM);
        this.addChild(this.backgroud, 0);

        //小图标闪烁效果
        var fadeIn_action = cc.FadeIn.create(1.0);
        var fadeOut_action = cc.FadeOut.create(1.0);
        this.menuIco = cc.Sprite.create(s_indexIcon);
        this.menuIco.setPosition(cc.p(15,size.height-2));
        this.menuIco.setAnchorPoint(Anchor.LEFT_TOP);
        this.menuIco.setScale(0.6,0.6);
        var forever = cc.RepeatForever.create(cc.Sequence.create(fadeIn_action, fadeOut_action));
        this.menuIco.runAction(forever);
        this.addChild(this.menuIco,1);
        //文字提示
        var button_tip = cc.LabelTTF.create("点击进入游戏", 'Tahoma', 14, cc.size(50, 50), cc.TEXT_ALIGNMENT_LEFT);
        button_tip.setAnchorPoint(Anchor.LEFT_TOP);
        button_tip.setPosition(cc.p(5,size.height-50));
        button_tip.setColor(cc.c3b(122, 2, 1));
        this.addChild(button_tip);

        //添加点击事件
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
        return true;
    },
    onMouseUp:function (touch) {
        if(this.containsTouchRange(touch)){
            //切换场景
            this.transition_scene.onTransition('LTKStartScene');
        }
    },
    onTouchesEnded:function (touch) {
        if(this.containsTouchRange(touch)){
            //切换场景
            this.transition_scene.onTransition('LTKStartScene');
        }
    },
    //判断点击落点是否在按钮的区域
    containsTouchRange:function(touch){
        //获取触摸点位置
        var getPoint = touch.getLocation();
        //获取图片区域尺寸
        var contentSize  =  this.menuIco.getContentSize();
        //定义点击区域
        var myRect = cc.rect(15, 260, contentSize.width, contentSize.height);
        //判断点击是否在区域上
        return cc.Rect.CCRectContainsPoint(myRect, getPoint);
    }
});

var backgroudLayer = cc.Layer.extend({
    backgroud:null,
    logo:null,
    start_gameBt:null,
    set_gameBt:null,
    exit_gameBt:null,
    transition_scene:null,
    init:function () {
        this._super();
        this.transition_scene = new StartScene();
        var size = cc.Director.getInstance().getWinSize();
        this.backgroud = cc.Sprite.create(s_mainMenu_bg);
//        this.backgroud.setScale(0.8,1.0);
        this.backgroud.setAnchorPoint(Anchor.LEFT_BOTTOM);
        this.addChild(this.backgroud, 0);
        var scaleMi_action = cc.ScaleTo.create(1.5,0.5,0.5);
        var scaleMa_action = cc.ScaleTo.create(1.5,0.52,0.52);
        var forever_scal = cc.RepeatForever.create(cc.Sequence.create(scaleMi_action, scaleMa_action));

        //三国杀logo
        this.logo = cc.Sprite.create(s_logo);
        this.logo.setScale(0.5,0.5);
        this.logo.setAnchorPoint(Anchor.LEFT_TOP);
        this.logo.setPosition(cc.p(0,size.height));
        this.logo.runAction(forever_scal);
        this.addChild(this.logo, 1);

        var startItem = cc.MenuItemImage.create(s_start_gameCli, s_start_gameDef, this.startMenu, this);
        var setItem = cc.MenuItemImage.create(s_set_gameCli, s_set_gameDef, this.setMenu, this);
        var exitItem = cc.MenuItemImage.create(s_exit_gameCli, s_exit_gameDef, this.exitMenu, this);

        var menu = cc.Menu.create(startItem, setItem, exitItem);
        menu.setTag(TAG_MENU);
        menu.setPosition(cc.p(size.width / 2, size.height / 2));
        this.addChild(menu, 2);
        menu.alignItemsVerticallyWithPadding(60);
        var p = menu.getPosition();
        menu.setPosition(cc.pAdd(p,cc.p(-20,0)));
    },
    startMenu:function(){
        this.transition_scene.onTransition('startGame');
    },
    setMenu:function(){
        this.transition_scene.onTransition('setGame');
    },
    exitMenu:function(){
        this.transition_scene.onTransition('indexScene');
    }
});
var swwLayer = cc.Layer.extend({
    start_img:null,
    init:function () {
        this._super();
        //图片三选一
        var random_num = Math.random();
        var start_img_url = '';
        if(random_num < 0.33){
            start_img_url = s_shu;
        }else if(random_num > 0.33 && random_num < 0.66){
            start_img_url = s_wei;
        }else{
            start_img_url = s_wu;
        }
        this.start_img = cc.Sprite.create(start_img_url);
        this.start_img.setAnchorPoint(Anchor.LEFT_BOTTOM);
        this.addChild(this.start_img, 0);
        return true;
    }
});

var IndexScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new IndexLayer();
        layer.init();
        this.addChild(layer,0);
    }
});
var LTKStartScene = cc.Scene.extend({
    transition_scene:null,
    onEnter:function () {
        this._super();
        this.transition_scene = new StartScene();
        var sww_layer = new swwLayer();
        sww_layer.init();
        this.addChild(sww_layer,0);
        //经过2秒转场
        this.scheduleOnce(this.toTransition, 2);
    },
    toTransition:function(){
        this.transition_scene.onTransition('LTKScene');
    }
});
var LTKScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new backgroudLayer();
        layer.init();
        this.addChild(layer,0);
    }
});



