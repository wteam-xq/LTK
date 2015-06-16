/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-1
 * Time: 下午12:50
 * To change this template use File | Settings | File Templates.
 */
var GAP_X = 70;
var GAP_Y = 20;
var g_bossModel = false;
var g_three_heroModel = true;
var g_musicPlay = true;
var g_sound_effect = true;
var g_music_vol = 0.25;
var g_sound_vol = 0.25;

var SettingLayer = cc.LayerColor.extend({
    dialog_title_bg:null,
    dialog_set_frame:null,
    transition_scene:null,
    setting_var:{
        bossModel:false,
        three_heroModel:false,
        musicPlay:false,
        sound_effect:false,
        music_vol:0,
        sound_vol:0
    },
    boss_menuTo:null,
    heros_menuTo:null,
    init:function () {
        this._super();
        this.transition_scene = new StartScene();
        this.setColor(new cc.Color3B(7,8,3));
        var size = cc.Director.getInstance().getWinSize();
        this.dialog_title_bg = cc.Sprite.create(s_dialog_title_bg);
        var title_height = this.dialog_title_bg.getContentSize().height;
        this.dialog_title_bg.setPosition(size.width/2,size.height-title_height/2);
        this.addChild(this.dialog_title_bg,2);

        //创建背景
        var set_background_img = cc.Sprite.create(s_battlBg);
        set_background_img.setAnchorPoint(Anchor.LEFT_BOTTOM);
        set_background_img.setPosition(cc.p(0,0));
        this.addChild(set_background_img,0);

        //读取本地存储设置值
        if(window.localStorage){
            var localDb = window.localStorage;
            var bossModel = localDb.getItem('bossModel');
            if(bossModel != null){
                g_bossModel = (bossModel == 'true');
                g_three_heroModel = (localDb.getItem('three_heroModel') == 'true');
                g_musicPlay = (localDb.getItem('musicPlay') == 'true');
                g_sound_effect = (localDb.getItem('sound_effect') == 'true');
                g_music_vol = parseFloat(localDb.getItem('music_vol'));
                g_sound_vol = parseFloat(localDb.getItem('sound_vol'));
            }
        }

        var set_font_width = this.dialog_title_bg.getContentSize().width;
        var set_font_height = this.dialog_title_bg.getContentSize().height;
        //字体
        var set_font = cc.LabelTTF.create("游戏设置", "Impact", 26, cc.size(set_font_width, set_font_height), cc.TEXT_ALIGNMENT_CENTER);
        set_font.setPosition(this.dialog_title_bg.getPosition());
        set_font.setColor(new cc.Color3B(211,161,0));
        this.addChild(set_font,4);
        //设置相关
        var min_font_sizeW = set_font.getContentSize().width;
        var min_font_sizeH = set_font.getContentSize().height;
        var min_font_pY = this.dialog_title_bg.getPositionY() - set_font_height/2 - GAP_Y;
        var min_font_pX = 70;
        var boss_model = cc.LabelTTF.create("BOSS模式", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        boss_model.setPosition(min_font_pX,min_font_pY);
        this.addChild(boss_model,4);
        var threeHeros_model = cc.LabelTTF.create("3武将模式", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        threeHeros_model.setPosition(min_font_pX + 170 + GAP_X,min_font_pY);
        this.addChild(threeHeros_model,4);
        min_font_pY -= 50;
        var close_music = cc.LabelTTF.create("开启音乐", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        close_music.setPosition(min_font_pX,min_font_pY);
        this.addChild(close_music,4);
        var close_soundEffect = cc.LabelTTF.create("开启音效", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        close_soundEffect.setPosition(min_font_pX + 170 + GAP_X,min_font_pY);
        this.addChild(close_soundEffect,4);
        min_font_pY -= 50;
        var music_volume = cc.LabelTTF.create("音乐音量:", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        music_volume.setPosition(min_font_pX,min_font_pY);
        this.addChild(music_volume,4);
        min_font_pY -= 50;
        var soundEffect_volume = cc.LabelTTF.create("音效音量:", "Comic Sans MS", 16, cc.size(min_font_sizeW, min_font_sizeH), cc.TEXT_ALIGNMENT_CENTER);
        soundEffect_volume.setPosition(min_font_pX,min_font_pY);
        this.addChild(soundEffect_volume,4);
        //确定、取消按钮
        min_font_pY -= 50;
        var submit_item = cc.MenuItemImage.create(s_certain_cli, s_certain_def, this.submitSet, this);
        var cancel_item = cc.MenuItemImage.create(s_cancel_cli, s_cancel_def, this.cancelSet, this);
        var menu = cc.Menu.create(submit_item, cancel_item);
        menu.setAnchorPoint(Anchor.LEFT_BOTTOM);
        menu.setScale(0.7,0.7);
        menu.setPosition(this.dialog_title_bg.getPositionX(),min_font_pY);
        this.addChild(menu, 4);
        menu.alignItemsHorizontallyWithPadding(40);

        //音乐、音效音量调节精灵按钮
        cc.MenuItemFont.setFontName("Marker Felt");
        cc.MenuItemFont.setFontSize(26);
        var music_vol = cc.MenuItemToggle.create(
            cc.MenuItemFont.create("0%"),
            cc.MenuItemFont.create("25%"),
            cc.MenuItemFont.create("50%"),
            cc.MenuItemFont.create("75%"),
            cc.MenuItemFont.create("100%"),
            this.musicAddVol, this
        );
        var temp_vol = g_music_vol;
        g_music_vol = 0;
        for(var i = 0;i < temp_vol;i+=0.25){
            music_vol.activate();
        }

        var soundEffect_vol = cc.MenuItemToggle.create(
            cc.MenuItemFont.create("0%"),
            cc.MenuItemFont.create("25%"),
            cc.MenuItemFont.create("50%"),
            cc.MenuItemFont.create("75%"),
            cc.MenuItemFont.create("100%"),
            this.soundEffectVol, this
        );
        temp_vol = g_sound_vol;
        g_sound_vol = 0;
        for(var j = 0;j < temp_vol;j += 0.25){
            soundEffect_vol.activate();
        }

        var sound_menu = cc.Menu.create(music_vol,soundEffect_vol);
        sound_menu.alignItemsInRows(1,1);
        sound_menu.alignItemsVerticallyWithPadding(25);
        sound_menu.setAnchorPoint(Anchor.LEFT_TOP);
        sound_menu.setPosition(soundEffect_volume.getPositionX() + 80,soundEffect_volume.getPositionY() + 27);
        this.addChild(sound_menu);

        //模式、静音选择按钮
        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(s_checkButton_plist, s_checkButton_png);
        //定义菜单按钮
        var boss_menuItemUns = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_unselected.png'), cc.Sprite.createWithSpriteFrameName('button_unselected_light.png'));
        var boss_menuItemS = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_selected.png'), cc.Sprite.createWithSpriteFrameName('button_selected_light.png'));

        this.boss_menuTo = cc.MenuItemToggle.create(boss_menuItemUns,boss_menuItemS,this.setBossMode,this);
        if(g_bossModel){//当前boss模式
            g_bossModel = !g_bossModel;//初始化时默认按钮暗淡
            this.boss_menuTo.activate();
        }
        var heros_menuItemUns = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_unselected.png'), cc.Sprite.createWithSpriteFrameName('button_unselected_light.png'));
        var heros_menuItemS = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_selected.png'), cc.Sprite.createWithSpriteFrameName('button_selected_light.png'));
        this.heros_menuTo = cc.MenuItemToggle.create(heros_menuItemUns,heros_menuItemS,this.setHerosMode,this);
        if(g_three_heroModel){//当前heros模式
            g_three_heroModel = !g_three_heroModel;//初始化时默认按钮暗淡
            this.heros_menuTo.activate();
        }
        var music_menuItemUns = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_unselected.png'), cc.Sprite.createWithSpriteFrameName('button_unselected_light.png'));
        var music_menuItemS = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_selected.png'), cc.Sprite.createWithSpriteFrameName('button_selected_light.png'));
        var music_Tomenu = null;
        if(g_musicPlay){//当前music模式
            music_Tomenu = cc.MenuItemToggle.create(music_menuItemS,music_menuItemUns,this.setMusicMode,this);
        }else{
            music_Tomenu = cc.MenuItemToggle.create(music_menuItemUns,music_menuItemS,this.setMusicMode,this);
        }
        var sound_menuItemUns = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_unselected.png'), cc.Sprite.createWithSpriteFrameName('button_unselected_light.png'));
        var sound_menuItemS = cc.MenuItemSprite.create(cc.Sprite.createWithSpriteFrameName('button_selected.png'), cc.Sprite.createWithSpriteFrameName('button_selected_light.png'));
        var sound_Tomenu = null;
        if(g_sound_effect){//当前sound模式
            sound_Tomenu = cc.MenuItemToggle.create(sound_menuItemS,sound_menuItemUns,this.setSoundMode,this);
        }else{
            sound_Tomenu = cc.MenuItemToggle.create(sound_menuItemUns,sound_menuItemS,this.setSoundMode,this);
        }
        var mode_menu = cc.Menu.create(this.boss_menuTo,this.heros_menuTo);
        mode_menu.alignItemsHorizontallyWithPadding(200);
        mode_menu.setPosition(this.dialog_title_bg.getPositionX() + 45,this.dialog_title_bg.getPositionY() - 45);
        this.addChild(mode_menu,4);

        var silence_menu = cc.Menu.create(music_Tomenu,sound_Tomenu);
        silence_menu.alignItemsHorizontallyWithPadding(200);
        silence_menu.setPosition(this.dialog_title_bg.getPositionX() + 45,this.dialog_title_bg.getPositionY() - 95);
        this.addChild(silence_menu,4);

        this.setting_var.bossModel = g_bossModel;
        this.setting_var.music_vol = g_music_vol;
        this.setting_var.musicPlay = g_musicPlay;
        this.setting_var.sound_effect = g_sound_effect;
        this.setting_var.sound_vol = g_sound_vol;
        this.setting_var.three_heroModel = g_three_heroModel;
    },
    submitSet:function(){
        //将设置项值存入本地localStorage
        if(!window.localStorage){
            alert('不支持本地存储！');
        }else{
            var localDb = window.localStorage;
            localDb.setItem('bossModel',g_bossModel);
            localDb.setItem('three_heroModel',g_three_heroModel);
            localDb.setItem('musicPlay',g_musicPlay);
            localDb.setItem('sound_effect',g_sound_effect);
            localDb.setItem('music_vol',g_music_vol);
            localDb.setItem('sound_vol',g_sound_vol);
        }
        this.transition_scene.onTransition('LTKScene');
    },
    cancelSet:function(){
        this.initSettingVar();//取消恢复初始设置
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
        cc.AudioEngine.getInstance().setMusicVolume(g_music_vol);
        cc.AudioEngine.getInstance().setEffectsVolume(g_sound_vol);
        this.transition_scene.onTransition('LTKScene');
    },
    musicAddVol:function(){
        g_music_vol += 0.25;
        if(g_music_vol > 1){
            g_music_vol = 0;
        }
        cc.AudioEngine.getInstance().setMusicVolume(g_music_vol);
    },
    soundEffectVol:function(){
       g_sound_vol += 0.25;
        if(g_sound_vol > 1){
            g_sound_vol = 0;
        }
        cc.AudioEngine.getInstance().setEffectsVolume(g_sound_vol);
    },
    setBossMode:function(){
        if(g_three_heroModel){
            if(this.heros_menuTo === null) return;
            this.heros_menuTo.activate();
        }
        g_bossModel = !g_bossModel;
    },
    setHerosMode:function(){
        if(g_bossModel){
            if(this.boss_menuTo === null) return;
            this.boss_menuTo.activate();
        }
        g_three_heroModel = !g_three_heroModel;
    },
    setMusicMode:function(){
        if(g_musicPlay){
            g_musicPlay = false;
            cc.AudioEngine.getInstance().pauseMusic();
        }else{
            g_musicPlay = true;
            cc.AudioEngine.getInstance().resumeMusic();
        }
    },
    setSoundMode:function(){
        if(g_sound_effect){
            g_sound_effect = false;
            cc.AudioEngine.getInstance().pauseAllEffects();
        }else{
            g_sound_effect = true;
            cc.AudioEngine.getInstance().resumeAllEffects();
        }
    },
    initSettingVar:function(){//初始化本类设置变量，修复转场设置变量bug
        g_music_vol = this.setting_var.music_vol;
        g_sound_vol =  this.setting_var.sound_vol;
        g_bossModel = this.setting_var.bossModel;
        g_three_heroModel = this.setting_var.three_heroModel;
        g_musicPlay = this.setting_var.musicPlay;
        g_sound_effect = this.setting_var.sound_effect;
    }
});

var SettingScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var set_layer = new SettingLayer();
        set_layer.init();
        this.addChild(set_layer,0);
    }
});