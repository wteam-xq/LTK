//
// startScene class
//
var StartScene = function(){};
//转场效果时间
var TRANSITIONDURATION = 1.2;
//角色
var role_ico = null;
//武将区域位置，选将逻辑调用
var enemy_positon = new Array(5);
var self_positon = new Array(5);
//供选择的武将（10选5）
var hero_back_one = new Array(5);
var hero_back_two = new Array(5);
//武将背景框
var self_heros = null;
var enemy_heros = null;
var chooseHero_range_one  = null;
var chooseHero_range_two = null;
var chooseHero_rangeBg = null;
//出战武将背景框
var playHero_range_one = null;
var playHero_rangeBg = null;
//布局调整常量
var ADJUSTWIDTH = 20;
var ADJUSTHEIGHT = 10;


//选中武将信息self_choosedHerosInfo记录选中武将信息，self_selectedHeros选择出战武将（5选3），self_selHeroPos出战武将位置
var self_choosedHerosInfo = new Array();
var self_selectedHeros = new Array(5);
var self_selHeroPos = new Array(8);
//ai选择的武将位置
var enemy_choosedHerosInfo = new Array();
//AI选择的武将ID
//var enemy_choosedHeroIds = new Array();
//正在闪烁的武将精灵ID
var pre_hitHeroId = null;
//武将出场顺序阶段，进入顺序区武将人数
var selected_num = 0;
var self_selected_num = 0;
var enemy_selected_num = 0;
//文字坐标
var font_tipX = 0;
var font_tipY = 0;

StartScene.prototype.onTransition = function(newScene){
    var scene = null;
    var tran_scene = null;
    switch(newScene){
        case 'indexScene':
            scene = new IndexScene();
            cc.AudioEngine.getInstance().stopMusic();
            tran_scene =  cc.TransitionFade.create(TRANSITIONDURATION,scene);
            break;
        case 'LTKStartScene':
            scene = new LTKStartScene();
            var localHero = new Hero();
            localHero.onCreateHeroData();
            tran_scene =  cc.TransitionFade.create(TRANSITIONDURATION,scene);
//            console.log(JSON.parse(localStorage.getItem('herodata')));
            break;
        case 'LTKScene':
            scene = new LTKScene();
            //使用localStorage本地存储
            if(window.localStorage ){
                //获得本地存储
                var localDb = window.localStorage;
                //本地存储有内容
                if(localDb.getItem('musicPlay') != null){
                    var is_music_play  = (localDb.getItem('musicPlay') == 'true');
                    var sound_effect = (localDb.getItem('sound_effect') == 'true');
                    var sound_vol = parseFloat(localDb.getItem('sound_vol'));
                    var music_vol = parseFloat(localDb.getItem('music_vol'));
                    cc.AudioEngine.getInstance().playMusic(s_menu_bgMusic,true);
                    cc.AudioEngine.getInstance().setMusicVolume(music_vol);
                    cc.AudioEngine.getInstance().setEffectsVolume(sound_vol);
                    if(is_music_play){
                        cc.AudioEngine.getInstance().resumeMusic();
                    }else{
                        cc.AudioEngine.getInstance().pauseMusic();
                    }
                    if(sound_effect){
                        cc.AudioEngine.getInstance().resumeAllEffects();
                    }else{
                        cc.AudioEngine.getInstance().pauseAllEffects();
                    }
                    tran_scene =  cc.TransitionSlideInR.create(TRANSITIONDURATION,scene);
                    break;
                }
            }else{
                alert('不支持本地存储！');
            }
            cc.AudioEngine.getInstance().playMusic(s_menu_bgMusic,true);
            cc.AudioEngine.getInstance().setMusicVolume(g_music_vol);
            //设置取消恢复全局音频设置
            if(g_musicPlay){
                cc.AudioEngine.getInstance().resumeMusic();
            }else{
                cc.AudioEngine.getInstance().pauseMusic();
            }
            if(g_sound_effect){
                cc.AudioEngine.getInstance().resumeAllEffects();
            }else{
                cc.AudioEngine.getInstance().pauseAllEffects();
            }
            tran_scene =  cc.TransitionSlideInR.create(TRANSITIONDURATION,scene);
            break;
        case 'setGame':
            scene = new SettingScene();
            cc.AudioEngine.getInstance().setMusicVolume(g_music_vol);
            tran_scene =  cc.TransitionSlideInL.create(TRANSITIONDURATION,scene);
            break;
        case 'startGame':
            if(start_layer != null){
                start_layer.removeAllChildren(true);
            }
            scene = new StartGameScene();
            tran_scene =  cc.TransitionSlideInR.create(TRANSITIONDURATION,scene);
            break;
        case 'startG_mainF':
            scene = new LTKScene();
            //离开游戏，初始化全局变量
            enemy_positon = new Array(5);
            self_positon = new Array(5);
            //供选择的武将（10选5）
            hero_back_one = new Array(5);
            hero_back_two = new Array(5);
            //武将背景框
            self_heros = null;
            enemy_heros = null;
            chooseHero_range_one  = null;
            chooseHero_range_two = null;
            chooseHero_rangeBg = null;
            //出战武将背景框
            playHero_range_one = null;
            playHero_rangeBg = null;
            self_selected_num = 0;
            enemy_selected_num = 0;
            //选中武将信息self_choosedHerosInfo记录选中武将信息，self_selectedHeros选择出战武将（5选3），self_selHeroPos出战武将位置
            self_choosedHerosInfo = new Array();
            self_selectedHeros = new Array(5);
            self_selHeroPos = new Array(8);
            //正在闪烁的武将精灵ID
            pre_hitHeroId = null;
            //武将出场顺序阶段，进入顺序区武将人数
            selected_num = 0;
            //已选择的3武将
            selected_heros = new Array(3);
            choosed_num = 0;
            //AI选择的武将初始化
            enemy_choosedHerosInfo = new Array();
            cc.Director.getInstance().getTouchDispatcher().removeAllDelegates();
            if(window.localStorage){
                var musicPlay = (window.localStorage.getItem('musicPlay') == 'true');
                if(musicPlay){
                    cc.AudioEngine.getInstance().playMusic(s_menu_bgMusic,true);
                }
            }else{
                if(g_musicPlay){
                    cc.AudioEngine.getInstance().playMusic(s_menu_bgMusic,true);
                }
            }
            tran_scene =  cc.TransitionSlideInL.create(TRANSITIONDURATION,scene);
            break;
        default:
            break;
    }
    //TransitionMoveInB 向下滚动 TransitionSlideInL 向左滚动 TransitionSlideInR 向右滚动 TransitionFade 渐变消失效果
    if (tran_scene){
        cc.Director.getInstance().replaceScene(tran_scene);
    }
};

//切换至选择出场武将页面
StartScene.prototype.onChooseHeroScene = function(role_value){
    var size = cc.Director.getInstance().getWinSize();
    //选将阶段
    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames(s_chooseHero_plist, s_chooseHero_png);
    cache.addSpriteFrames(s_SHeroIco_plist, s_SHeroIco_png);
    cache.addSpriteFrames(s_SHeroIco_plistPane, s_SHeroIco_pngPane);

    self_heros = cc.Sprite.createWithSpriteFrameName('hero_fram.png');
    enemy_heros = cc.Sprite.createWithSpriteFrameName('hero_fram.png');
    chooseHero_range_one  = cc.Sprite.createWithSpriteFrameName('hero_fram.png');
    chooseHero_range_two = cc.Sprite.createWithSpriteFrameName('hero_fram.png');
//    chooseHero_rangeBg = cc.Sprite.createWithSpriteFrameName('choose_heroRange.png');
    chooseHero_rangeBg = new ChooseHeroField();
    var hero_fram_height = chooseHero_range_one.getContentSize().height;
    self_heros.setPosition(cc.p(size.width/2 - ADJUSTWIDTH,hero_fram_height - ADJUSTHEIGHT));
    chooseHero_rangeBg.setPosition(cc.p(size.width/2 - ADJUSTWIDTH,size.height/2 + ADJUSTHEIGHT));
    chooseHero_range_one.setPosition(cc.p(size.width/2 - ADJUSTWIDTH,size.height/2 + hero_fram_height/2 + ADJUSTHEIGHT));
    chooseHero_range_two.setPosition(cc.p(size.width/2 - ADJUSTWIDTH,size.height/2 - hero_fram_height/2 + ADJUSTHEIGHT));
    enemy_heros.setPosition(cc.p(size.width/2 - ADJUSTWIDTH,size.height - hero_fram_height/2));

    //Monarch turnCoat 1V1只有两种身份
    role_ico = null;
    if(role_value == 'Monarch'){
        role_ico = cc.Sprite.createWithSpriteFrameName('gamebg03.png');
        enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg06.png');
    }else if(role_value == 'turnCoat'){
        role_ico = cc.Sprite.createWithSpriteFrameName('gamebg06.png');
        enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg03.png');
    }else{
        alert('身份出错！');
        return;
    }
    role_ico.setPosition(cc.p(size.width*6/7 - 10,size.height/4));

    //武将图像区域位置
    var chooseHeroO_position = new Array(5);
    var chooseHeroT_position = new Array(5);

    var hero_fram_width = chooseHero_range_one.getContentSize().width/5;
    var enemy_positionX = enemy_heros.getPositionX();
    var enemy_positionY = enemy_heros.getPositionY();
    var self_positionX = self_heros.getPositionX();
    var self_positionY = self_heros.getPositionY();
    var chooseHeroO_positionX = chooseHero_range_one.getPositionX();
    var chooseHeroO_positionY = chooseHero_range_one.getPositionY();
    var chooseHeroT_positionX = chooseHero_range_two.getPositionX();
    var chooseHeroT_positionY = chooseHero_range_two.getPositionY();
    for(Hindex = 0; Hindex < 5; Hindex++){
        var anchor_width = 2 - Hindex;
        enemy_positon[Hindex] = cc.p(enemy_positionX - hero_fram_width*anchor_width,enemy_positionY);
        self_positon[Hindex] = cc.p(self_positionX - hero_fram_width*anchor_width,self_positionY);
        chooseHeroO_position[Hindex] = cc.p(chooseHeroO_positionX - hero_fram_width*anchor_width,chooseHeroO_positionY);
        chooseHeroT_position[Hindex] = cc.p(chooseHeroT_positionX - hero_fram_width*anchor_width,chooseHeroT_positionY);
    }

    //随机在10武将中分配6个正面、4个背面数字
    var hero_status_array = new Array(10);
    var true_status_num = 0;
    var false_status_num = 0;
    for(var i = 0; i < 10; i++){
        var random_num = Math.random();
        //60%是正面
        if(random_num > 0.4){
            if(true_status_num >= 6){
                hero_status_array[i] = false;
                continue;
            }
            hero_status_array[i] = true;
            true_status_num++;
        }else{
            if(false_status_num >= 4){
                hero_status_array[i] = true;
                continue;
            }
            hero_status_array[i] = false;
            false_status_num++;
        }
    }
    //25武将编号中随机抽取10编号
    var heros_id = new Array(25);
    for(var i = 0; i < 25;i++){
        heros_id[i] = (i+1);
    }
    var commonAI = new CommonAI();
    var appear_heroId = commonAI.randomArray(heros_id,25);

    for(var i = 0; i < 10; i++){
        var j = 0;
        if(i < 5){
            hero_back_one[i] = new Hero_back_sprite(hero_status_array[i],appear_heroId[i],i);
            hero_back_one[i].setPosition(chooseHeroO_position[i]);
            start_layer.addChild(hero_back_one[i],4);
        }else{
            j = i - 5;
            hero_back_two[j] = new Hero_back_sprite(hero_status_array[i],appear_heroId[i],i);
            hero_back_two[j].setPosition(chooseHeroT_position[j]);
            start_layer.addChild(hero_back_two[j],4);
        }
    }
    start_layer.addChild(self_heros,3);
    start_layer.addChild(chooseHero_rangeBg,2);
    start_layer.addChild(chooseHero_range_one,3);
    start_layer.addChild(chooseHero_range_two,3);
    start_layer.addChild(enemy_heros,3);
    start_layer.addChild(role_ico,3);
    //Monarch turnCoat 1V1只有两种身份
    var tip_X = self_heros.getPositionX();
    var tip_Y = self_heros.getPositionY();

    /*//直接跳到出牌阶段（测试）
    this.onStartPlayCard();
    return;*/

    chooseHero_rangeBg.chooseHero_num = 1;
    //判断当前玩家角色
    if(role_value == 'Monarch'){
        new ShowInfo(tip_X,tip_Y + 80,'moment','请选择1名武将');
    }else if(role_value == 'turnCoat'){
        chooseHero_rangeBg.chooseHero_num = 0;
        var AIChoose = new ChooseHeroAI();
        AIChoose.chooseHeroCard(1);
    }
};

//切换至选择出战武将阶段
StartScene.prototype.onPlayedHeroScene = function(){
    //加载中间选区精灵
    var size = cc.Director.getInstance().getWinSize();
    var middle_positionX = size.width/2 - ADJUSTWIDTH;
    var middle_positionY = size.height/2 + ADJUSTHEIGHT;
    //中间精灵消失
    chooseHero_range_one.setVisible(false);
    chooseHero_range_two.setVisible(false);
    chooseHero_rangeBg.setVisible(false);
    for(var i = 0; i < 5; i++){
        hero_back_one[i].setVisible(false);
        hero_back_two[i].setVisible(false);
    }

    //AI选择武将显示
    for(var j = 0; j < 5; j++){
        var enemyHero_index = enemy_choosedHerosInfo[j];
        if(enemyHero_index < 5){
            hero_back_one[enemyHero_index].setVisible(true);
        }else{
            hero_back_two[enemyHero_index - 5].setVisible(true);
        }
    }
    playHero_range_one  = cc.Sprite.createWithSpriteFrameName('player_hero_fram.png');
    playHero_rangeBg = cc.Sprite.createWithSpriteFrameName('play_heros.png');
    playHero_range_one.setPosition(cc.p(middle_positionX,middle_positionY));
    playHero_rangeBg.setPosition(cc.p(middle_positionX,middle_positionY));
    start_layer.addChild(playHero_range_one,3);
    start_layer.addChild(playHero_rangeBg,2);

    //文字说明
    var tip_X = self_heros.getPositionX();
    var tip_Y = self_heros.getPositionY();
    new ShowInfo(tip_X,tip_Y + 80,'phase','请分配武将出场顺序');
    //加载已选武将精灵
    for(var sNum = 0; sNum < 5; sNum++){
        var status = self_choosedHerosInfo[sNum].status;
        var id = self_choosedHerosInfo[sNum].id;
        self_selectedHeros[sNum] =  new Self_selected_sprite(status,id,sNum);
        self_selectedHeros[sNum].setPosition(self_positon[sNum]);
        start_layer.addChild(self_selectedHeros[sNum],5);
        //选择武将放置区
        self_selHeroPos[sNum] = new Hero_ico_fram(sNum);
        self_selHeroPos[sNum].selectedHero = self_selectedHeros[sNum];
        //选区有武将时，取消其事件监听
        cc.Director.getInstance().getTouchDispatcher().removeDelegate(self_selHeroPos[sNum]);
        self_selHeroPos[sNum].setPosition(self_positon[sNum]);
        start_layer.addChild(self_selHeroPos[sNum],4);
    }
    var hero_fram_width = chooseHero_range_one.getContentSize().width/5;
    //放置出场武将区(中间部分)
    for(var i=0;i < 3;i++){
        var anchor_width = (1 - i)*hero_fram_width;
        var sNum = i + 5;
        var played_hero_position = cc.p(middle_positionX - anchor_width,middle_positionY);
        self_selHeroPos[sNum] = new Hero_ico_fram(sNum);
        self_selHeroPos[sNum].setPosition(played_hero_position);
        start_layer.addChild(self_selHeroPos[sNum],4);
    }
};

//正式开始游戏牌阶段
StartScene.prototype.onStartPlayCard = function(){
   /* //测试
    enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg03.png');
    if(role_one.role_value == 'Monarch'){
        //设置AI身份
        enemy_roleIco = cc.Sprite.createWithSpriteFrameName('gamebg06.png');
    }
    //方便测试，手动设置武将值
    enemy_choosedHerosInfo = new Array(0,1,2,3,4);
    //选将完成，AI选将5选3
    var SelectHeroAI = new ChooseHeroAI();
    SelectHeroAI.choosePlayHero(enemy_choosedHerosInfo);
    //己方3武将
    var diyId = new Array(12,13,20);*/
    //去除前阶段所有事件委派
    cc.Director.getInstance().getTouchDispatcher().removeAllDelegates();

    //选将阶段
    var cache = cc.SpriteFrameCache.getInstance();
    cache.addSpriteFrames(s_gameCard_plist, s_gameCard_png);

    //已选择3武将ID
    var selected_ids = new Array(3);
    var selected_herosX = self_heroX   - BODERSPACE;
    var selected_herosY = self_heroY  - BODERSPACE;

    //己方武将区
    var selfHerosLayer = cc.Layer.create();
    //已选择的3武将
    var selected_heros = new Array(3);
    for(var i=0; i < 3; i++){
        selected_ids[i] = self_selHeroPos[(5+i)].selectedHero.hero_id;
//        selected_ids[i] = diyId[i];
        selected_heros[i] = new Hero_sprite(selected_ids[i],'square');
        selected_heros[i].setAnchorPoint(Anchor.RIGHT_TOP);
        selected_heros[i].setPosition(cc.p(selected_herosX,selected_herosY));
        selected_herosY -= selected_heros[i].getContentSize().height;
        selfHerosLayer.addChild(selected_heros[i],0,i);
    }
    selfHerosLayer.setPosition(Anchor.LEFT_BOTTOM);
    //添加己方武将区至总面板，Tag：7
    start_layer.addChild(selfHerosLayer,5,7);

    var hero_icoPanePosX = role_ico.getPositionX();
    var hero_icoPanePosY = role_ico.getPositionY();
    var role_icoW = role_ico.getContentSize().width;
    var role_icoH = role_ico.getContentSize().height;
    var self_heroPane = new Hero_sprite(selected_ids[0],'pane');
    self_heroPane.setAnchorPoint(Anchor.LEFT_TOP);
    self_heroPane.setPosition(cc.p(hero_icoPanePosX-role_icoW/2 + BODERSPACE,hero_icoPanePosY+role_icoH/2-BODERSPACE));
    //信息区武将遮罩层
    var self_heroP_shade = new Hero_sprite('headfram','other');
    self_heroP_shade.setAnchorPoint(Anchor.LEFT_TOP);
    self_heroP_shade.setPosition(self_heroPane.getPosition());
    //读取本地数据库
    var localHero = new Hero();
    localHero.onCreateHeroData();
    var current_hero_id = selected_ids[0].toString();
    var current_hero = JSON.parse(localHero.wrapJsonStorage('herodata').get(current_hero_id));
    var heroHP = current_hero.full_blood;
    var hero_power = current_hero.power;
//    var heroHP_ico = new Array(heroHP);
    var heroHPX = self_heroPane.getPositionX() + self_heroPane.getContentSize().width + BODERSPACE;
    var heroHPY = self_heroPane.getPositionY() + BODERSPACE;
    //己方信息区
    var selfInfoLayer = cc.Layer.create();
    for(var k = 0; k < heroHP; k++){
        var heroHP_ico = new Hero_sprite('small5');
        heroHP_ico.setAnchorPoint(Anchor.LEFT_TOP);
        heroHP_ico.setPosition(cc.p(heroHPX,heroHPY));
        heroHPY -= (heroHP_ico.getContentSize().height + 2);
        //添加血量图片
        selfInfoLayer.addChild(heroHP_ico,1,(3 + k));
    }
    var hero_pTTFX = self_heroPane.getPositionX() + self_heroPane.getContentSize().width/2;
    var hero_pTTFY = self_heroPane.getPositionY() - self_heroPane.getContentSize().height;
    for(var i = 0; i < hero_power.length; i++){
        var hero_powerTTF = cc.LabelTTF.create(hero_power[i],'Verdana',14,cc.size(20,20),cc.TEXT_ALIGNMENT_LEFT);
        hero_powerTTF.setColor(new cc.Color3B(255,150,64));
//        hero_powerTTF.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
        hero_powerTTF.setPosition(cc.p(hero_pTTFX,hero_pTTFY));
        hero_pTTFY -= hero_powerTTF.getContentSize().height + 3;
        //添加技能文字
        selfInfoLayer.addChild(hero_powerTTF,2,(10 + i));
    }
    selfInfoLayer.addChild(self_heroPane,0,1);
    selfInfoLayer.addChild(self_heroP_shade,1,2);
    selfInfoLayer.setPosition(Anchor.LEFT_BOTTOM);
    //添加己方信息区至总面板，Tag：5
    start_layer.addChild(selfInfoLayer,2,5);
    //提示字切换
    start_layer.getChildByTag(16).setVisible(false);
    var tip_X = self_heros.getPositionX();
    var tip_Y = self_heros.getPositionY();
//    new ShowInfo(tip_X,tip_Y + 80,'moment','武将出战顺序完成，开始发牌');
    //全局变量保存文字坐标
    font_tipX = tip_X;
    font_tipY = tip_Y;

    //初始化牌组
    var cardStack = new CardHeapSprite();
    cardStack.initCard();
    //打乱数组
    var j = 0;
    var x = null;
    for(var i = cardStack.cardArray.length - 1; i > 0; --i){
        j = Math.floor(Math.random() * i);
        x = cardStack.cardArray[i];
        cardStack.cardArray[i] = cardStack.cardArray[j];
        cardStack.cardArray[j] = x;
    }
//    console.log(cardStack.cardArray);
    //抽取四张手牌,并显示
    var Hcard = new Array();
    for(var card_index = 0; card_index < 4; card_index++){
        Hcard.push(cardStack.cardArray.pop());
    }
    //己方游戏牌其实位置
    var self_gameCardX = chooseHero_rangeBg.getPositionX() - chooseHero_rangeBg.getContentSize().width/2 + 10;
    var self_gameCardY = 6;
    //游戏牌间隔choosePlayHero
    var gameCardDistance = Hcard[0].getContentSize().width;
    //手牌区
    var HcardFieldLayer = cc.Layer.create();
    HcardFieldLayer.setPosition(Anchor.LEFT_BOTTOM);
    //游戏牌显示
    for(var Hcard_index = 0; Hcard_index < Hcard.length; Hcard_index++){
        var card_name = Hcard[Hcard_index].name;
        Hcard[Hcard_index].showCardImg();
        Hcard[Hcard_index].setAnchorPoint(Anchor.LEFT_BOTTOM);
        Hcard[Hcard_index].setPosition(cc.p(self_gameCardX,self_gameCardY));
        self_gameCardX += gameCardDistance;
        //开始不能出的被动牌（闪、无懈、桃、借刀）无法响应事件以及黑色遮罩显示
        if( card_name == 'dogde' || card_name =='ward' || card_name == 'peach' || card_name == 'borrowedSword'){
            Hcard[Hcard_index].unablePlay();
        }
        HcardFieldLayer.addChild(Hcard[Hcard_index],(2+Hcard_index),Hcard_index);
    }
    //添加手牌区至总面板，Tag：2
    start_layer.addChild(HcardFieldLayer,2,2);
    start_layer.addChild(cardStack,0,11);
    //获得对方信息区
    var enemyLayer = start_layer.getChildByTag(10);
    //对方抽取四张手牌,并显示手牌数
    var enemyHcard = new Array();
    for(var enemyC_index = 0; enemyC_index < 4; enemyC_index++){
        enemyHcard.push(cardStack.cardArray.pop());
    }
    var enemyCardNum = new enemeyHcardNum(4);
    enemyCardNum.sprite_array = enemyHcard;
    var enemyCardNumX = enemyLayer.getChildByTag(2).getPositionX() + (47 - 14);
    var enemyCardNumY = enemyLayer.getChildByTag(2).getPositionY();
    enemyCardNum.setPosition(enemyCardNumX,enemyCardNumY);
    enemyLayer.addChild(enemyCardNum,9);
    var self_role = role_one.role_value;
    //删除没选择的武将及相关精灵
    console.log('删除子类前精灵个数：' + start_layer._children.length);
    start_layer.removeChild(role_one,true);
    start_layer.removeChild(role_two,true);
    start_layer.removeChild(self_heros,true);
    start_layer.removeChild(enemy_heros,true);
    start_layer.removeChild(chooseHero_range_one,true);
    start_layer.removeChild(chooseHero_range_two,true);
    start_layer.removeChild(chooseHero_rangeBg,true);
    start_layer.removeChild(playHero_range_one,true);
    start_layer.removeChild(playHero_rangeBg,true);
    for(var i = 0;i < 5;i++){
        start_layer.removeChild(hero_back_one[i],true);
        start_layer.removeChild(hero_back_two[i],true);
        start_layer.removeChild(self_selectedHeros[i],true);
    }
    for(var j = 0; j < 8; j++){
        start_layer.removeChild(self_selHeroPos[j],true);
    }
    console.log('删除子类后精灵个数:' + start_layer._children.length);
    //删除所有文字提示
    start_layer.removeChildByTag(15);
    cache.addSpriteFrames(s_gamePhase_plist, s_gamePhase_png);
    //跳转至游戏阶段循环阶段
    if(self_role === 'Monarch'){
        //进入对方回合
        var AIPhase = new GamePhaseAI();
        AIPhase.startPhase();
    }else{
        //进入己方回合
        var selfPhase = new GamePlayingScene();
        selfPhase.startPhase();
    }
};