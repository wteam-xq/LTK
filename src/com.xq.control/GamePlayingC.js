/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-24
 * Time: 上午1:15
 * To change this template use File | Settings | File Templates.
 */
var GamePlayingScene = function(){};
//该对象全局变量
GamePlayingScene.prototype.play_menu = null;
GamePlayingScene.prototype.discard_menu = null;
GamePlayingScene.prototype.end_menu = null;
GamePlayingScene.prototype.tip_X = 0;
GamePlayingScene.prototype.tip_Y = 0;

//游戏五阶段：回合开始阶段、摸牌阶段、出牌阶段、弃牌阶段、回合结束阶段
GamePlayingScene.prototype.startPhase = function(){
    var size = cc.Director.getInstance().getWinSize();
    var tip_X = size.width/2;
    var tip_Y = 100;
    new ShowInfo(tip_X - 150,tip_Y,'phase_tip','startPhase.png');
    setTimeout(function(){
        var self_phase = new GamePlayingScene();
        var size = cc.Director.getInstance().getWinSize();
        var tip_X = size.width/2;
        self_phase.drawCardPhase(tip_X,100);
    },1300);
};
GamePlayingScene.prototype.drawCardPhase = function(posX,posY){
    this.tip_X = posX;
    this.tip_Y = posY;
    //进入摸牌阶段
    new ShowInfo(posX - 150,posY,'phase_tip','drawCardPhase.png');
    var sureSpriteButD = cc.Sprite.createWithSpriteFrameName('sureDefault.png');
    var sureSpriteButH = cc.Sprite.createWithSpriteFrameName('sureHited.png');
    sureSpriteButD.setOpacity(180);
    var cancelDef = cc.Sprite.createWithSpriteFrameName('cancelDefault.png');
    var cancelHit = cc.Sprite.createWithSpriteFrameName('cancelHited.png');
    cancelDef.setOpacity(180);
    //按“确定”按钮进入下一阶段
    var play_submitBut = cc.MenuItemSprite.create(sureSpriteButH ,sureSpriteButD ,this.drawSubmit,this);
    var play_cancelBut = cc.MenuItemSprite.create(cancelHit ,cancelDef ,this.drawCancel,this);
    this.play_menu = cc.Menu.create(play_submitBut,play_cancelBut);
    this.play_menu.alignItemsHorizontallyWithPadding(30);
    this.play_menu.setPosition(cc.p(posX,posY + 10));
    //将按钮菜单放入总面板，tga：18
    start_layer.addChild(this.play_menu,4,18);


};
GamePlayingScene.prototype.playCardPhase = function(){
    //进入出牌阶段
    new ShowInfo(this.tip_X - 150,this.tip_Y,'phase_tip','playCardPhase.png');
    //‘确定’ ‘弃牌’按钮
    var sureSpriteButD = cc.Sprite.createWithSpriteFrameName('sureDefault.png');
    var sureSpriteButH = cc.Sprite.createWithSpriteFrameName('sureHited.png');
    sureSpriteButD.setOpacity(180);
    var discardButD = cc.Sprite.createWithSpriteFrameName('discardDefault.png');
    var discardButH = cc.Sprite.createWithSpriteFrameName('discardHited.png');
    discardButD.setOpacity(180);
    var play_submitBut = cc.MenuItemSprite.create(sureSpriteButH ,sureSpriteButD ,this.playSubmit,this);
    var play_discardBut = cc.MenuItemSprite.create(discardButH ,discardButD ,this.playDiscard,this);
    this.discard_menu = cc.Menu.create(play_submitBut,play_discardBut);
    this.discard_menu.alignItemsHorizontallyWithPadding(30);
    this.discard_menu.setPosition(cc.p(this.tip_X,this.tip_Y + 10));
    //将按钮菜单放入总面板，tga：19
    start_layer.addChild(this.discard_menu,4,19);
};
GamePlayingScene.prototype.discardCardPhase = function(){
    //进入弃牌阶段
    new ShowInfo(this.tip_X - 150,this.tip_Y,'phase_tip','discardPhase.png');
    var sureUnabelBut = cc.Sprite.createWithSpriteFrameName('sureUnable.png');
    var sureHitBut = cc.Sprite.createWithSpriteFrameName('sureHited.png');
    sureUnabelBut.setOpacity(180);
    //丢弃牌操作
    var discard_submitBut = cc.MenuItemSprite.create(sureHitBut ,sureUnabelBut ,this.discardHit,this);
    this.end_menu = cc.Menu.create(discard_submitBut);
    this.end_menu.setPosition(cc.p(this.tip_X,this.tip_Y + 10));
    //将按钮菜单放入总面板，tga：20
    start_layer.addChild(this.end_menu,4,20);
    //弃牌调整牌间距
};
GamePlayingScene.prototype.endPhase = function(){
    new ShowInfo(this.tip_X - 150,this.tip_Y,'phase_tip','endPhase.png');
    console.log('至此自己回合结束，进入对方回合');
};

//摸事件牌
GamePlayingScene.prototype.drawSubmit = function(){
    //点击确定进入下一阶段
    //新增两张牌，牌间距变化
    var cardStack = start_layer.getChildByTag(11).cardArray;
    //己方手牌区变化
    var selfHandLayer = start_layer.getChildByTag(2);
    var handCard_num = selfHandLayer.getChildrenCount();
    var firstCard = selfHandLayer.getChildByTag(0);
    var newCardX = firstCard.getPositionX() + firstCard.getContentSize().width*handCard_num;
    var newCardY = firstCard.getPositionY();
    for(var new_cardIndex = 0; new_cardIndex < 2;new_cardIndex++){
        var newCardSprite = cardStack.pop();
        newCardSprite.setAnchorPoint(Anchor.LEFT_BOTTOM);
        newCardSprite.setPosition(cc.p(newCardX,newCardY));
        newCardX += firstCard.getContentSize().width;
        selfHandLayer.addChild(newCardSprite,(2+handCard_num+new_cardIndex),(handCard_num+new_cardIndex));
    }
    newCardX = firstCard.getPositionX();
    handCard_num = selfHandLayer.getChildrenCount();
    //手牌重新布局
    var gameCardDistance = firstCard.getContentSize().width*5/(handCard_num);
    var handCardArray = selfHandLayer.getChildren();
    for(var Hcard_index = 0; Hcard_index < handCardArray.length;Hcard_index++){
        var card_name = handCardArray[Hcard_index].name;
        handCardArray[Hcard_index].setPosition(cc.p(newCardX,newCardY));
        handCardArray[Hcard_index].ablePlay();
        handCardArray[Hcard_index].showCardImg();
        newCardX += gameCardDistance;
        //开始不能出的被动牌（闪、无懈、桃、借刀）无法响应事件以及黑色遮罩显示
        if( card_name == 'dogde' || card_name =='ward' || card_name == 'peach' || card_name == 'borrowedSword'){
            handCardArray[Hcard_index].unablePlay();
        }
    }
    start_layer.removeChildByTag(18,true);
    this.playCardPhase();
};
GamePlayingScene.prototype.drawCancel = function(){
    alert('取消');
};
//出牌事件
GamePlayingScene.prototype.playSubmit = function(){
    alert('确定');
};
GamePlayingScene.prototype.playDiscard = function(){
    start_layer.removeChildByTag(19,true);
    this.discardCardPhase();
};
//弃牌事件
GamePlayingScene.prototype.discardHit = function(){
    //如果弃牌张数不足则要求继续弃牌
    start_layer.removeChildByTag(20,true);
    this.endPhase();
};

