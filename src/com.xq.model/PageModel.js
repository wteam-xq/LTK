/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-17
 * Time: 上午10:18
 * To change this template use File | Settings | File Templates.
 */

//已选择武将数量（10选5）
var choosed_num = 0;
//图像武将精灵（根据ID获得图像,两种图：正方形、长方形）
var Hero_sprite = cc.Sprite.extend({
    hero_id:0,
    ctor:function(id,type){
        this.hero_id = id;
        if(type === 'square'){
            this.initSquare();
        }else if(type === 'pane'){
            this.initPane();
        }else{
            this.initOther();
        }
    },
    initSquare:function(){
        var heroIco_name = null;
        if(this.hero_id < 10){
            heroIco_name = '900' + this.hero_id;
        }else{
            heroIco_name = '90' + this.hero_id;
        }
        heroIco_name += '.png';
        this.initWithSpriteFrameName(heroIco_name);
    },
    initPane:function(){
        var heroIco_name = 'head';
        heroIco_name += (this.hero_id + '.png');
        this.initWithSpriteFrameName(heroIco_name);
    },
    initOther:function(){
        var heroIco_name = this.hero_id + '.png';
        this.initWithSpriteFrameName(heroIco_name);
    }
});

//武将背面精灵
var Hero_back_sprite = cc.Sprite.extend({
    TransScene:null,
    isFront:null,
    hero_id:null,
    position_index:0,
    AI_chooseNum:2,
    ctor:function(status,id,pos_index){
        this.isFront = status;
        this.hero_id = id;
        this.position_index = pos_index;
        if(this.isFront){
            this.showHeroIco(id);
        }else{
            this.initWithSpriteFrameName('hero_back.png');
        }
        this.TransScene = new StartScene();
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
        //当AI正在选择武将时，点击无效
        if(chooseHero_rangeBg.chooseHero_num === 0){
            return;
        }
        if (this.containsTouchLocation(touch)){
            //保存已选武将信息
            var selected_heroInfo = {status:this.isFront,id:this.hero_id};
            self_choosedHerosInfo.push(selected_heroInfo);
            //更新剩余武将数组
            chooseHero_rangeBg.updateRemainderId(this.position_index);
            if(!this.isFront){
                this.showHeroIco(this.hero_id);
            }
            //动作效果
            var moveTo_action = cc.MoveTo.create(1,self_positon[self_selected_num]);
            self_selected_num++;
            choosed_num++;
            var elastic_action = cc.EaseElasticOut.create(moveTo_action,0.8);
            this.runAction(elastic_action);
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
            var tip_X = self_heros.getPositionX();
            var tip_Y = self_heros.getPositionY();
            if(choosed_num >= 10){
                //禁止点击没选武将事件
                for(var i = 0; i < 5; i++){
                    cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_one[i]);
                    cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_two[i]);
                }
                //2秒后转换场景
                this.scheduleOnce(this.toTransition, 2);
                new ShowInfo(tip_X,tip_Y + 80,'moment','选将完毕，两秒后进入下一阶段');
                return;
            }
            chooseHero_rangeBg.decreaseSelfChooseNum();
            if(chooseHero_rangeBg.chooseHero_num > 0){
                new ShowInfo(tip_X,tip_Y + 80,'moment','请再选择1名武将');
                return;
            }
            //等待AI选将
            if(choosed_num == 9){
                this.AI_chooseNum = 1;
                new ShowInfo(tip_X,tip_Y + 80,'moment','等待对方选择1名武将');
            } else{
                new ShowInfo(tip_X,tip_Y + 80,'moment','等待对方选择2名武将');
            }
            this.scheduleOnce(this.onAIAction,1);
        }
    },
    toTransition:function(){
        choosed_num = 0;
        this.TransScene.onPlayedHeroScene();
    },
    //展示武将头像
    showHeroIco:function(id){
        var heroIco_name = null;
        if(id < 10){
            heroIco_name = '900' + id;
        }else{
            heroIco_name = '90' + id;
        }
        heroIco_name += '.png';
        this.initWithSpriteFrameName(heroIco_name);
    },
    //AI选将
    onAIAction:function(){
        var AIChoose = new ChooseHeroAI();
        AIChoose.chooseHeroCard(this.AI_chooseNum);
    }/*,
    AITransition:function(){
        var tip_X = self_heros.getPositionX();
        var tip_Y = self_heros.getPositionY();
        new ShowInfo(tip_X,tip_Y+80,'moment','选将完毕，两秒后进入下一阶段');
        choosed_num = 0;
        this.TransScene.onPlayedHeroScene();
    }*/
});

//已选武将精灵(继承背面武将精灵)
var Self_selected_sprite = Hero_back_sprite.extend({
    isBlink:false,
    blinkSprite:null,
    arrayNum:0,
    isSchedule:false,
    positionNum:0,
    ctor:function(status,id,sNum){
        this._super(status,id,sNum);
        this.showHeroIco(id);
        this.arrayNum = sNum;
        this.blinkImgId = 0;
        this.blinkSprite = new BlinkSprite(sNum);
        this.positionNum = sNum;
        start_layer.addChild(this.blinkSprite,5);
    },
    //触摸事件
    onTouchBegan:function (touch){
        if (this.containsTouchLocation(touch)){
            //取消之前武将头像闪烁效果
            if(pre_hitHeroId !== null){
                self_selectedHeros[pre_hitHeroId].onBlinkFadeOut();
            }
            if(pre_hitHeroId == this.arrayNum){
                pre_hitHeroId = null;
                return;
            }
            pre_hitHeroId = this.arrayNum;
            //切换头像闪烁、光晕效果,当前正在闪烁使其变暗，当前暗淡使其闪烁
            if(this.isBlink){
                this.onBlinkFadeOut();
            }else{
                this.onBlinkFadeIn();
            }
        }
    },
    //头像持续闪烁
    onBlink:function(){
        this.blinkImgId++;
        if(this.blinkImgId > 10){
            this.blinkImgId = 0;
        }
        var blink_img_name = 'ach_select' + this.blinkImgId + '.png';
        this.initWithSpriteFrameName(blink_img_name);
    },
    //闪烁出现
    onBlinkFadeIn:function(){
        this.blinkSprite.setVisible(true);
        if(this.isSchedule){
            this.blinkSprite.resumeSchedulerAndActions();
        }else{
            this.blinkSprite.schedule(this.onBlink,0.1);
            this.isSchedule = true;
        }
        this.isBlink = true;
    },
    //闪烁消失
    onBlinkFadeOut:function(){
        this.blinkSprite.setVisible(false);
        this.blinkSprite.unschedule();
        this.isBlink = false;
    }
});
//闪烁精灵
var BlinkSprite = cc.Sprite.extend({
    blinkImgId:0,
    isFlash:false,
    ctor:function(sNum){
        this._super();
        this.initWithSpriteFrameName('ach_select0.png');
        this.setVisible(false);
        this.setPosition(self_positon[sNum]);
    }
});
//武将出场顺序框精灵
var Hero_ico_fram = Hero_back_sprite.extend({
    selectedHero:null,
    positionNum:0,
    ctor:function(sNum){
        this._super();
        this.positionNum = sNum;
        this.initWithFile(s_heroIcoFram);
    },//触摸事件
    onTouchBegan:function (touch){
        if (this.containsTouchLocation(touch)){
            //武将移动
            if(this.selectedHero != null){
                return;
            }
            var choosed_point = this.getPosition();
            if(pre_hitHeroId !== null){
                var preHeroPosNum = self_selectedHeros[pre_hitHeroId].positionNum;
                if(preHeroPosNum >= 5 && this.positionNum < 5 ){
                    selected_num--;
                }else if(preHeroPosNum < 5 && this.positionNum >= 5){
                    selected_num++
                }
                //闪烁武将移动，
                self_selectedHeros[pre_hitHeroId].onBlinkFadeOut();
                var moveTo_action = cc.MoveTo.create(1,choosed_point);
                var elastic_action = cc.EaseElasticOut.create(moveTo_action,0.8);
                self_selectedHeros[pre_hitHeroId].runAction(elastic_action);
                self_selectedHeros[pre_hitHeroId].blinkSprite.setPosition(choosed_point);
                //本顺序框加入武将
                this.selectedHero = self_selectedHeros[pre_hitHeroId];
                self_selectedHeros[pre_hitHeroId].positionNum = this.positionNum;
                cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
                //原顺序框移除武将
                self_selHeroPos[preHeroPosNum].selectedHero = null;
                cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(self_selHeroPos[preHeroPosNum]);
                pre_hitHeroId = null;
                if(selected_num == 3){
                    //选将完成，进入出牌阶段
                    var SelectHeroAI = new ChooseHeroAI();
                    SelectHeroAI.choosePlayHero(enemy_choosedHerosInfo);
                    this.TransScene.onStartPlayCard();
                }
            }
        }
    }
});

//文字显示精灵
var ShowInfo = cc.Sprite.extend({
    moment_info_tip:null,
    posX:null,
    posY:null,
    fontType:null,
    tipStr:null,
    phaseImg:null,
    scheduleSprite:null,
    ctor:function(positionX,positionY,font_type,str){
        this._super();
        this.scheduleSprite = cc.Sprite.create(s_indexIcon);
        this.posX = positionX;
        this.posY = positionY;
        this.fontType = font_type;
        this.tipStr = str;
        if(font_type === 'moment'){
            this.momentTip();
        }else if(font_type === 'phase'){
            this.phaseTip();
        }else if(font_type === 'phase_tip'){
            this.phaseImgTip();
        }
    },
    momentTip:function(){
        this.moment_info_tip = cc.LabelTTF.create(this.tipStr, "Symbol", 18, cc.size(20, 20), cc.TEXT_ALIGNMENT_CENTER);
        this.moment_info_tip.setVisible(true);
        this.moment_info_tip.setColor(new cc.Color3B(255,255,255));
        this.moment_info_tip.setPosition(cc.p(this.posX,this.posY - 20));
        var fadeOut_tip = cc.FadeOut.create(2);
        var moveTo_tip = cc.MoveTo.create(0.5,cc.p(this.posX,this.posY));
        this.moment_info_tip.runAction(cc.Sequence.create(moveTo_tip, fadeOut_tip));
        start_layer.addChild(this.moment_info_tip,4,15);
    },
    phaseTip:function(){
        info_tip = cc.LabelTTF.create(this.tipStr, "Symbol", 18, cc.size(20, 20), cc.TEXT_ALIGNMENT_CENTER);
        info_tip.setColor(new cc.Color3B(255,255,255));
        info_tip.setPosition(cc.p(this.posX,this.posY));
        start_layer.addChild(info_tip,4,16);
    },
    phaseImgTip:function(){
        this.phaseImg = cc.Sprite.createWithSpriteFrameName(this.tipStr);
        this.phaseImg.setPosition(cc.p(this.posX,this.posY - 10));
        var fadeOut_tip = cc.FadeOut.create(1);
        var moveTo_tip = cc.MoveTo.create(0.5,cc.p(this.posX,this.posY));
        this.phaseImg.runAction(cc.Sequence.create(moveTo_tip, fadeOut_tip));
        start_layer.addChild(this.phaseImg,4,17);
    }
});

//选将区精灵
var ChooseHeroField = cc.Sprite.extend({
    chooseHero_num:0,
    remainder_id:null,
    ctor:function(){
        this._super();
        this.initWithSpriteFrameName('choose_heroRange.png');
        this.remainder_id = new Array(10);
        //初始化剩余武将数组
        for(var i = 0; i < 10; i++){
            this.remainder_id[i] = i;
        }
    },
    updateRemainderId:function(id){
        //删除对应ID值，注意id值与index的区别
        for(var id_index = 0; id_index < this.remainder_id.length; id_index++){
            if(this.remainder_id[id_index] == id){
                this.remainder_id.splice(id_index,1);
            }
        }
    },
    decreaseSelfChooseNum:function(){
        this.chooseHero_num--;
    }
});
//对方武将精灵
var enemy_back_sprite = cc.Sprite.extend({
    isFront:null,
    hero_id:null,
    position_index:0,
    ctor:function(status,id,pos_index){
        this.isFront = status;
        this.hero_id = id;
        this.position_index = pos_index;
        if(this.isFront){
            this.showHeroIco();
        }else{
            this.initWithSpriteFrameName('hero_back.png');
        }
    },
    //展示武将头像
    showHeroIco:function(){
        var heroIco_name = null;
        if(this.hero_id < 10){
            heroIco_name = '900' + this.hero_id;
        }else{
            heroIco_name = '90' + this.hero_id;
        }
        heroIco_name += '.png';
        this.initWithSpriteFrameName(heroIco_name);
    }
});

//牌堆精灵
var CardHeapSprite = cc.Sprite.extend({
    //弃牌堆
    cardDiscard:null,
    //牌堆
    cardArray:null,
    ctor:function(){
        this._super();
        this.cardArray = new Array();
    },
    initCard:function(){
        //初始化104 + 4(ex)张游戏牌
        //杀(30张)
        var strike_1 = new CardSprite('strike','squarePiece','6','basic','deckCard_id_1','strikeMagic');
        var strike_2 = new CardSprite('strike','squarePiece','7','basic','deckCard_id_2','strikeMagic');
        var strike_3 = new CardSprite('strike','squarePiece','8','basic','deckCard_id_3','strikeMagic');
        var strike_4 = new CardSprite('strike','squarePiece','9','basic','deckCard_id_4','strikeMagic');
        var strike_5 = new CardSprite('strike','squarePiece','10','basic','deckCard_id_5','strikeMagic');
        var strike_6 = new CardSprite('strike','squarePiece','K','basic','deckCard_id_6','strikeMagic');
        var strike_7 = new CardSprite('strike','Spades','7','basic','deckCard_id_7','strikeMagic');
        var strike_8 = new CardSprite('strike','Spades','8','basic','deckCard_id_8','strikeMagic');
        var strike_9 = new CardSprite('strike','Spades','8','basic','deckCard_id_9','strikeMagic');
        var strike_10 = new CardSprite('strike','Spades','9','basic','deckCard_id_10','strikeMagic');
        var strike_11 = new CardSprite('strike','Spades','9','basic','deckCard_id_11','strikeMagic');
        var strike_12 = new CardSprite('strike','Spades','10','basic','deckCard_id_12','strikeMagic');
        var strike_13 = new CardSprite('strike','Spades','10','basic','deckCard_id_13','strikeMagic');
        var strike_14 = new CardSprite('strike','redPeach','10','basic','deckCard_id_14','strikeMagic');
        var strike_15 = new CardSprite('strike','redPeach','10','basic','deckCard_id_15','strikeMagic');
        var strike_16 = new CardSprite('strike','redPeach','J','basic','deckCard_id_16','strikeMagic');
        var strike_17 = new CardSprite('strike','plum','2','basic','deckCard_id_17','strikeMagic');
        var strike_18 = new CardSprite('strike','plum','3','basic','deckCard_id_18','strikeMagic');
        var strike_19 = new CardSprite('strike','plum','4','basic','deckCard_id_19','strikeMagic');
        var strike_20 = new CardSprite('strike','plum','5','basic','deckCard_id_20','strikeMagic');
        var strike_21 = new CardSprite('strike','plum','6','basic','deckCard_id_21','strikeMagic');
        var strike_22 = new CardSprite('strike','plum','7','basic','deckCard_id_22','strikeMagic');
        var strike_23 = new CardSprite('strike','plum','8','basic','deckCard_id_23','strikeMagic');
        var strike_24 = new CardSprite('strike','plum','8','basic','deckCard_id_24','strikeMagic');
        var strike_25 = new CardSprite('strike','plum','9','basic','deckCard_id_25','strikeMagic');
        var strike_26 = new CardSprite('strike','plum','9','basic','deckCard_id_26','strikeMagic');
        var strike_27 = new CardSprite('strike','plum','10','basic','deckCard_id_27','strikeMagic');
        var strike_28 = new CardSprite('strike','plum','10','basic','deckCard_id_28','strikeMagic');
        var strike_29 = new CardSprite('strike','plum','J','basic','deckCard_id_29','strikeMagic');
        var strike_30 = new CardSprite('strike','plum','J','basic','deckCard_id_30','strikeMagic');
        //牌堆加入杀
        for(var stri_index = 1; stri_index <= 30; stri_index++){
            this.cardArray.push(eval('strike_' + stri_index));
        }
        //闪(15张)
        var dogde_1 = new CardSprite('dogde','squarePiece','2','basic','deckCard_id_31','dogdeMagic');
        var dogde_2 = new CardSprite('dogde','squarePiece','2','basic','deckCard_id_32','dogdeMagic');
        var dogde_3 = new CardSprite('dogde','squarePiece','3','basic','deckCard_id_33','dogdeMagic');
        var dogde_4 = new CardSprite('dogde','squarePiece','4','basic','deckCard_id_34','dogdeMagic');
        var dogde_5 = new CardSprite('dogde','squarePiece','5','basic','deckCard_id_35','dogdeMagic');
        var dogde_6 = new CardSprite('dogde','squarePiece','6','basic','deckCard_id_36','dogdeMagic');
        var dogde_7 = new CardSprite('dogde','squarePiece','7','basic','deckCard_id_37','dogdeMagic');
        var dogde_8 = new CardSprite('dogde','squarePiece','8','basic','deckCard_id_38','dogdeMagic');
        var dogde_9 = new CardSprite('dogde','squarePiece','9','basic','deckCard_id_39','dogdeMagic');
        var dogde_10 = new CardSprite('dogde','squarePiece','10','basic','deckCard_id_40','dogdeMagic');
        var dogde_11 = new CardSprite('dogde','squarePiece','J','basic','deckCard_id_41','dogdeMagic');
        var dogde_12 = new CardSprite('dogde','squarePiece','J','basic','deckCard_id_42','dogdeMagic');
        var dogde_13 = new CardSprite('dogde','redPeach','2','basic','deckCard_id_43','dogdeMagic');
        var dogde_14 = new CardSprite('dogde','redPeach','2','basic','deckCard_id_44','dogdeMagic');
        var dogde_15 = new CardSprite('dogde','redPeach','K','basic','deckCard_id_45','dogdeMagic');
        for(var dogde_index = 1; dogde_index <= 15; dogde_index++){
            this.cardArray.push(eval('dogde_' + dogde_index));
        }
        //桃（8）
        var peach_1 = new CardSprite('peach','squarePiece','2','basic','deckCard_id_46','peachMagic');
        var peach_2 = new CardSprite('peach','squarePiece','Q','basic','deckCard_id_47','peachMagic');
        var peach_3 = new CardSprite('peach','redPeach','3','basic','deckCard_id_48','peachMagic');
        var peach_4 = new CardSprite('peach','redPeach','4','basic','deckCard_id_49','peachMagic');
        var peach_5 = new CardSprite('peach','redPeach','7','basic','deckCard_id_50','peachMagic');
        var peach_6 = new CardSprite('peach','redPeach','8','basic','deckCard_id_51','peachMagic');
        var peach_7 = new CardSprite('peach','redPeach','9','basic','deckCard_id_52','peachMagic');
        var peach_8 = new CardSprite('peach','redPeach','Q','basic','deckCard_id_53','peachMagic');
        for(var peach_index = 1; peach_index <= 8; peach_index++){
            this.cardArray.push(eval('peach_' + peach_index));
        }
        //锦囊(36)
        var scroll_1 = new CardSprite('lighting','redPeach','Q','scroll','deckCard_id_54','lightingMagic');
        var scroll_2 = new CardSprite('lighting','Spades','A','scroll','deckCard_id_55','lightingMagic');
        var scroll_3 = new CardSprite('contentment','plum','6','scroll','deckCard_id_56','contentmentMagic');
        var scroll_4 = new CardSprite('contentment','redPeach','6','scroll','deckCard_id_57','contentmentMagic');
        var scroll_5 = new CardSprite('contentment','Spades','6','scroll','deckCard_id_58','contentmentMagic');
        var scroll_6 = new CardSprite('ward','squarePiece','Q','scroll','deckCard_id_59','wardMagic');
        var scroll_7 = new CardSprite('ward','Spades','J','scroll','deckCard_id_60','wardMagic');
        var scroll_8 = new CardSprite('ward','plum','Q','scroll','deckCard_id_61','wardMagic');
        var scroll_9 = new CardSprite('ward','plum','K','scroll','deckCard_id_62','wardMagic');
        var scroll_10 = new CardSprite('borrowedSword','plum','Q','scroll','deckCard_id_63','borrowedSwordMagic');
        var scroll_11 = new CardSprite('borrowedSword','plum','K','scroll','deckCard_id_64','borrowedSwordMagic');
        var scroll_12 = new CardSprite('bountifulHarvest','redPeach','3','scroll','deckCard_id_65','bountifulHarvestMagic');
        var scroll_13 = new CardSprite('bountifulHarvest','redPeach','4','scroll','deckCard_id_66','bountifulHarvestMagic');
        var scroll_14 = new CardSprite('somethingForNothing','redPeach','7','scroll','deckCard_id_67','somethingForNothingMagic');
        var scroll_15 = new CardSprite('somethingForNothing','redPeach','8','scroll','deckCard_id_68','somethingForNothingMagic');
        var scroll_16 = new CardSprite('somethingForNothing','redPeach','9','scroll','deckCard_id_69','somethingForNothingMagic');
        var scroll_17 = new CardSprite('somethingForNothing','redPeach','J','scroll','deckCard_id_70','somethingForNothingMagic');
        var scroll_18 = new CardSprite('duel','squarePiece','A','scroll','deckCard_id_71','duelMagic');
        var scroll_19 = new CardSprite('duel','Spades','A','scroll','deckCard_id_72','duelMagic');
        var scroll_20 = new CardSprite('duel','plum','A','scroll','deckCard_id_73','duelMagic');
        var scroll_21 = new CardSprite('peachGarden','redPeach','A','scroll','deckCard_id_74','peachGardenMagic');
        var scroll_22 = new CardSprite('barbarianInvasion','Spades','7','scroll','deckCard_id_75','barbarianInvasionMagic');
        var scroll_23 = new CardSprite('barbarianInvasion','Spades','K','scroll','deckCard_id_76','barbarianInvasionMagic');
        var scroll_24 = new CardSprite('barbarianInvasion','plum','7','scroll','deckCard_id_77','barbarianInvasionMagic');
        var scroll_25 = new CardSprite('arrowBarrage','redPeach','A','scroll','deckCard_id_78','arrowBarrageMagic');
        var scroll_26 = new CardSprite('snatch','squarePiece','3','scroll','deckCard_id_79','snatchMagic');
        var scroll_27 = new CardSprite('snatch','squarePiece','4','scroll','deckCard_id_80','snatchMagic');
        var scroll_28 = new CardSprite('snatch','Spades','3','scroll','deckCard_id_81','snatchMagic');
        var scroll_29 = new CardSprite('snatch','Spades','4','scroll','deckCard_id_82','snatchMagic');
        var scroll_30 = new CardSprite('snatch','Spades','J','scroll','deckCard_id_83','snatchMagic');
        var scroll_31 = new CardSprite('dismantle','Spades','3','scroll','deckCard_id_84','dismantleMagic');
        var scroll_32 = new CardSprite('dismantle','Spades','4','scroll','deckCard_id_85','dismantleMagic');
        var scroll_33 = new CardSprite('dismantle','Spades','Q','scroll','deckCard_id_86','dismantleMagic');
        var scroll_34 = new CardSprite('dismantle','redPeach','Q','scroll','deckCard_id_87','dismantleMagic');
        var scroll_35 = new CardSprite('dismantle','plum','3','scroll','deckCard_id_88','dismantleMagic');
        var scroll_36 = new CardSprite('dismantle','plum','4','scroll','deckCard_id_89','dismantleMagic');
        for(var scroll_index = 1; scroll_index <= 36; scroll_index++){
            this.cardArray.push(eval('scroll_' + scroll_index));
        }
        //装备牌(19)
        var equip_1 = new CardSprite('clawFly','redPeach','K','equip','deckCard_id_90','addInstanceMagic');
        var equip_2 = new CardSprite('luma','plum','5','equip','deckCard_id_91','addInstanceMagic');
        var equip_3 = new CardSprite('shadowrunner','Spades','5','equip','deckCard_id_92','addInstanceMagic');
        var equip_4 = new CardSprite('redHare','redPeach','5','equip','deckCard_id_93','desInstanceMagic');
        var equip_5 = new CardSprite('purpleXing','squarePiece','K','equip','deckCard_id_94','desInstanceMagic');
        var equip_6 = new CardSprite('blba','Spades','K','equip','deckCard_id_95','desInstanceMagic');
        var equip_7 = new CardSprite('chuKoNu','squarePiece','A','equip','deckCard_id_96','weaponMagic');
        var equip_8 = new CardSprite('chuKoNu','plum','A','equip','deckCard_id_97','weaponMagic');
        var equip_9 = new CardSprite('frostSword','Spades','2','equip','deckCard_id_98','weaponMagic');
        var equip_10 = new CardSprite('blackPommel','Spades','6','equip','deckCard_id_99','weaponMagic');
        var equip_11 = new CardSprite('yinYangSwords','Spades','2','equip','deckCard_id_100','weaponMagic');
        var equip_12 = new CardSprite('stonePiercingAxe','squarePiece','5','equip','deckCard_id_101','weaponMagic');
        var equip_13 = new CardSprite('greenDragonCrescentBlade','Spades','5','equip','deckCard_id_102','weaponMagic');
        var equip_14 = new CardSprite('eighteenSpanViperSpear','Spades','Q','equip','deckCard_id_103','weaponMagic');
        var equip_15 = new CardSprite('heavenlyDoubleHalberd','squarePiece','Q','equip','deckCard_id_104','weaponMagic');
        var equip_16 = new CardSprite('qilinBow','redPeach','5','equip','deckCard_id_105','weaponMagic');
        var equip_17 = new CardSprite('eightDiagramFormation','plum','2','equip','deckCard_id_106','eightDiagramFormationMagic');
        var equip_18 = new CardSprite('eightDiagramFormation','Spades','2','equip','deckCard_id_107','eightDiagramFormationMagic');
        var equip_19 = new CardSprite('sageKingShield','plum','2','equip','deckCard_id_108','sageKingShieldMagic');
        for(var equip_index = 1; equip_index <= 19; equip_index++){
            this.cardArray.push(eval('equip_' + equip_index));
        }
//        console.log(this.cardArray);
    }
});

//卡牌精灵
var CardSprite = cc.Sprite.extend({
    name:null,
    color:null,
    num:null,
    type:null,
    id:null,
    magic:null,
    ifFront:true,
    blaceShade:null,
    ctor:function(name,color,num,type,id,magic){
        this._super();
        this.name = name;
        this.color = color;
        this.num = num;
        this.type = type;
        this.id = id;
        this.magic = magic;
        this.initWithSpriteFrameName(this.name + '.png');
    },
    showCardImg:function(){
        var spriteHeight = this.getContentSize().height;
        //添加花色
        var colorSprite = cc.Sprite.createWithSpriteFrameName(this.color + '.png');
        colorSprite.setAnchorPoint(Anchor.LEFT_TOP);
        colorSprite.setPosition(cc.p(2,spriteHeight - 2));
        this.addChild(colorSprite,2,1);

        //添加数字
        var fontNum = cc.LabelTTF.create(this.num,"Arial", 14, cc.size(20, 20), cc.TEXT_ALIGNMENT_CENTER);
        fontNum.setColor(new cc.Color3B(0,0,0));
        if(this.color === 'red'){
            fontNum.setColor(new cc.Color3B(234,2,2));
        }
        fontNum.setAnchorPoint(Anchor.LEFT_TOP);
        fontNum.setPosition(cc.p(-2,spriteHeight - 11));
        this.addChild(fontNum,2,2);
    },
    hideCardImg:function(){
        this.removeAllChildren(true);
        this.initWithSpriteFrameName('cardBack.png');
    },
    //无法打出(添加遮罩)
    unablePlay:function(){
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(this);
        var shadeWidth = this.getContentSize().width;
        var shadeHeight = this.getContentSize().height;
        //添加黑色遮罩
        this.blaceShade = cc.LayerColor.create(new cc.Color3B(0,0,0),shadeWidth,shadeHeight);
        this.blaceShade.setOpacity(150);
        this.blaceShade.setPosition(cc.p(0,0));
        this.addChild(this.blaceShade,3,3);
    },
    //卡牌初始化
    ablePlay:function(){
        cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this);
        if(this.getChildByTag(1)){
            this.removeChildByTag(1);
        }
        if(this.getChildByTag(2)){
            this.removeChildByTag(2);
        }
        if(this.getChildByTag(3)){
            this.removeChildByTag(3);
        }
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
            //卡牌位置变化
            console.log('卡牌有反应啦');
        }
    }
});

//对手手牌数量图标
var enemeyHcardNum = cc.LayerColor.extend({
    num:0,
    sprite_array:null,
    ctor:function(num){
        this._super();
        this.num = num.toString();
        this.setOpacity(100);
        this.init(new cc.Color3B(176,186,151),14,15);
        var numTTF = cc.LabelTTF.create(this.num,"Symbol", 14, cc.size(20, 20), cc.TEXT_ALIGNMENT_CENTER);
        numTTF.setAnchorPoint(Anchor.LEFT_BOTTOM);
        numTTF.setPosition(cc.p(-2,-3));
        this.addChild(numTTF,0,1);
    }
});