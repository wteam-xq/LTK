/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-17
 * Time: 上午10:19
 * To change this template use File | Settings | File Templates.
 */
//选择武将AI
var ChooseHeroAI = function(){};
var CommonAI = function(){};

ChooseHeroAI.prototype.chooseHeroCard = function(num){
    var commonAI = new CommonAI();
    var selected_id = commonAI.randomArray(chooseHero_rangeBg.remainder_id,num);
    //将选中id的对应武将加入武将框
    for( i in selected_id){
        var move_positon = enemy_positon[enemy_selected_num];
        var hero_pos_index = selected_id[i];
        //选中武将ID
        var hero_selected_id = null;
        //动作效果
        var moveTo_action = cc.MoveTo.create(1,move_positon);
        var elastic_action = cc.EaseElasticOut.create(moveTo_action,0.8);
        if(hero_pos_index >= 5){
            hero_back_two[hero_pos_index - 5].runAction(elastic_action);
            hero_selected_id = hero_back_two[hero_pos_index - 5].hero_id;
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_two[hero_pos_index - 5]);
        }else{
            hero_back_one[hero_pos_index].runAction(elastic_action);
            hero_selected_id = hero_back_one[hero_pos_index].hero_id;
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_one[hero_pos_index]);
        }
        //保存已选武将信息(武将位置)
        enemy_choosedHerosInfo.push(hero_pos_index);
//        enemy_choosedHeroIds.push(hero_selected_id);
        //更新剩余武将数组
        chooseHero_rangeBg.updateRemainderId(hero_pos_index);
        choosed_num++;
        enemy_selected_num++;
    }
    var tip_X = self_heros.getPositionX();
    var tip_Y = self_heros.getPositionY();
    if(choosed_num >= 10){
        //禁止点击没选武将事件
        for(var i = 0; i < 5; i++){
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_one[i]);
            cc.Director.getInstance().getTouchDispatcher().removeDelegate(hero_back_two[i]);
        }
        //2秒后转换场景
//        current_heroBack.scheduleOnce(current_heroBack.AITransition, 2);
        TransScene = new StartScene();
        TransScene.onPlayedHeroScene();
        return;
    }
    if(choosed_num == 9){
        chooseHero_rangeBg.chooseHero_num = 1;
        new ShowInfo(tip_X,tip_Y + 80,'moment','请选择1名武将');
    }else{
        chooseHero_rangeBg.chooseHero_num = 2;
        new ShowInfo(tip_X,tip_Y + 80,'moment','请选择2名武将');
    }
};

ChooseHeroAI.prototype.choosePlayHero = function(hero_array){
    var selected_hero_status = new Array(3);
    //对方选中武将ID
    var selected_ids = new Array(3);
    var commonAI = new CommonAI();
    //从5个武将中随机选取3武将
    var selected_hero = commonAI.randomArray(hero_array,3);
    //获得选中武将信息
    for(var j = 0;j < selected_hero.length;j++){
        var hero_pos_index = selected_hero[j];
        if(hero_pos_index < 5){
            selected_ids[j] = hero_back_one[hero_pos_index].hero_id;
            selected_hero_status[j] = true;
        }else{
            selected_ids[j] = hero_back_two[hero_pos_index - 5].hero_id;
            selected_hero_status[j] = true;
        }
    }
//    console.log('AI选出的3武将ID:' + selected_ids);
    //将选中的3武将加入对方武将区
    var size = cc.Director.getInstance().getWinSize();
    var enemy_herosX = 0 + 2*BODERSPACE;
    var enemy_herosY = size.height  - 2*BODERSPACE;
    //对方武将区
    var enemyHerosLayer = cc.Layer.create();
    //放入AI武将区的3武将
    var selected_heros = new Array(3);
    selected_hero_status[0] = true;
    for(var i=0; i < 3; i++){
        selected_heros[i] = new enemy_back_sprite(selected_hero_status[i],selected_ids[i],i);
        selected_heros[i].setAnchorPoint(Anchor.LEFT_TOP);
        selected_heros[i].setPosition(cc.p(enemy_herosX,enemy_herosY));
        enemy_herosY -= selected_heros[i].getContentSize().height;
        enemyHerosLayer.addChild(selected_heros[i],0,i);
    }
    enemyHerosLayer.setPosition(Anchor.LEFT_BOTTOM);

    //添加对方武将区至总面板，Tag：9
    start_layer.addChild(enemyHerosLayer,5,9);
    //对方信息区
    var enemyInfo_layer = cc.Layer.create();
    var enemy_info_sprite = cc.Sprite.create(s_enemy_info);
    var enemy_infoSH = enemy_info_sprite.getContentSize().height;
    enemy_info_sprite.setPosition(cc.p(size.width/2,size.height - enemy_infoSH/2));
    //武将头像
    var playHeroIco = new enemy_back_sprite(true,selected_ids[0],0);
    var enemy_infoW = enemy_info_sprite.getContentSize().width;
    var enemy_infoH = enemy_info_sprite.getContentSize().height;
    var enemy_heroH = playHeroIco.getContentSize().height;
    var enemy_heroW = playHeroIco.getContentSize().width;
    playHeroIco.setAnchorPoint(Anchor.LEFT_BOTTOM);
    playHeroIco.setPosition(cc.p(size.width/2-enemy_infoW/2 + 6,size.height - enemy_infoH + 3));

    //放置AI身份
    enemy_roleIco.setAnchorPoint(Anchor.LEFT_TOP);
    enemy_roleIco.setPosition(cc.p(size.width/2-enemy_infoW/2,size.height - enemy_infoH + enemy_heroH + 4));
    //放置武将生命值
    var localHero = new Hero();
    var current_hero = JSON.parse(localHero.wrapJsonStorage('herodata').get(selected_ids[0]));
    var enemy_heroHP = current_hero.full_blood;
    var heroHP_ico = new Hero_sprite('small5');
    var heroHpW = heroHP_ico.getContentSize().width;
    var enemy_heroHpX = size.width/2 - enemy_infoW/2 + enemy_heroW + heroHpW/2 + 2;
    var enemy_heroHpY = size.height;
    for(var k = 0; k < enemy_heroHP; k++){
        var heroHP_ico = new Hero_sprite('small5');
        heroHP_ico.setAnchorPoint(Anchor.LEFT_TOP);
        heroHP_ico.setPosition(cc.p(enemy_heroHpX,enemy_heroHpY));
        enemy_heroHpY -= (heroHP_ico.getContentSize().height - 2);
        //添加血量图片
        enemyInfo_layer.addChild(heroHP_ico,2,(4 + k));
    }
    enemyInfo_layer.addChild(enemy_info_sprite,1,1);
    enemyInfo_layer.addChild(playHeroIco,2,2);
    enemyInfo_layer.addChild(enemy_roleIco,3,3);
    enemyInfo_layer.setPosition(Anchor.LEFT_BOTTOM);
    //添加对方信息区至总面板，Tag：10
    start_layer.addChild(enemyInfo_layer,2,10);
};

//从数组中随机抽取num个数组值
CommonAI.prototype.randomArray = function(arr, num){
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
};

//AI游戏阶段：回合开始阶段、摸牌阶段、出牌阶段、弃牌阶段、回合结束阶段
var GamePhaseAI = function(){};
GamePhaseAI.prototype.startPhase = function(){
    var size = cc.Director.getInstance().getWinSize();
    var tip_X = size.width/2;
    var tip_Y = size.height - 50;
    new ShowInfo(tip_X - 50,tip_Y,'phase_tip','startPhase.png');
    //1秒后往下执行
    setTimeout(function(){
        //方便写代码，跳转至己方回合测试
        var self_phase = new GamePlayingScene();
        self_phase.startPhase();
    },1000);
};
GamePhaseAI.prototype.drawCardPhase = function(){

};
GamePhaseAI.prototype.playCardPhase = function(){

};
GamePhaseAI.prototype.discardCardPhase = function(){

};
GamePhaseAI.prototype.endPhase = function(){

};

//实现延时进入下一阶段
GamePhaseAI.prototype.toSelfPhase = function(){

};
