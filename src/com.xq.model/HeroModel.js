/**
 * Created with JetBrains WebStorm.
 * User: asus
 * Date: 13-5-17
 * Time: 上午10:19
 * To change this template use File | Settings | File Templates.
 */
var Hero = function(){};

Hero.prototype.onCreateHeroData = function(){
    //判断是否已经有数据
    var heroStorage = this.wrapJsonStorage('herodata');
    if(heroStorage.has("1")){
        return;
    }
    //往数据库写入内容
    var liuBei_json = {"hero_id":1,"full_blood":4,"power":["仁德","激将"],"country":"shu","sex":"male","name":"刘备"};
    heroStorage.set("1",JSON.stringify(liuBei_json));
    var guanYu_json = {"hero_id":2,"full_blood":4,"power":["武圣"],"country":"shu","sex":"male","name":"关羽"};
    heroStorage.set("2",JSON.stringify(guanYu_json));
    var zhangFei_json = {"hero_id":3,"full_blood":4,"power":["咆哮"],"country":"shu","sex":"male","name":"张飞"};
    heroStorage.set("3",JSON.stringify(zhangFei_json));
    var zhuGeLiang_json = {"hero_id":4,"full_blood":3,"power":["观星","空城"],"country":"shu","sex":"male","name":"诸葛亮"};
    heroStorage.set("4",JSON.stringify(zhuGeLiang_json));
    var zhaoYun_json = {"hero_id":5,"full_blood":4,"power":["龙胆"],"country":"shu","sex":"male","name":"赵云"};
    heroStorage.set("5",JSON.stringify(zhaoYun_json));
    var maChao_json = {"hero_id":6,"full_blood":4,"power":["马术","铁骑"],"country":"shu","sex":"male","name":"马超"};
    heroStorage.set("6",JSON.stringify(maChao_json));
    var huangYueYing_json = {"hero_id":7,"full_blood":3,"power":["集智","奇才"],"country":"shu","sex":"female","name":"黄月英"};
    heroStorage.set("7",JSON.stringify(huangYueYing_json));

    var sunQuan_json = {"hero_id":8,"full_blood":4,"power":["制衡","救援"],"country":"wu","sex":"male","name":"孙权"};
    heroStorage.set("8",JSON.stringify(sunQuan_json));
    var guanNing_json = {"hero_id":9,"full_blood":4,"power":["奇袭"],"country":"wu","sex":"male","name":"甘宁"};
    heroStorage.set("9",JSON.stringify(guanNing_json));
    var lvMeng_json = {"hero_id":10,"full_blood":4,"power":["克己"],"country":"wu","sex":"male","name":"吕蒙"};
    heroStorage.set("10",JSON.stringify(lvMeng_json));
    var huangGai_json = {"hero_id":11,"full_blood":4,"power":["苦肉"],"country":"wu","sex":"male","name":"黄盖"};
    heroStorage.set("11",JSON.stringify(huangGai_json));
    var zhouYu_json = {"hero_id":12,"full_blood":3,"power":["英姿","反间"],"country":"wu","sex":"male","name":"周瑜"};
    heroStorage.set("12",JSON.stringify(zhouYu_json));
    var daQiao_json = {"hero_id":13,"full_blood":3,"power":["国色","流离"],"country":"wu","sex":"female","name":"大乔"};
    heroStorage.set("13",JSON.stringify(daQiao_json));
    var luXun_json = {"hero_id":14,"full_blood":3,"power":["谦逊","连营"],"country":"wu","sex":"male","name":"陆逊"};
    heroStorage.set("14",JSON.stringify(luXun_json));
    var sunShangXiang_json = {"hero_id":25,"full_blood":3,"power":["结姻","枭姬"],"country":"wu","sex":"female","name":"孙尚香"};
    heroStorage.set("25",JSON.stringify(sunShangXiang_json));

    var caoCao_json = {"hero_id":15,"full_blood":4,"power":["奸雄","护驾"],"country":"wei","sex":"male","name":"曹操"};
    heroStorage.set("15",JSON.stringify(caoCao_json));
    var siMaYi_json = {"hero_id":16,"full_blood":3,"power":["反馈","鬼才"],"country":"wei","sex":"male","name":"司马懿"};
    heroStorage.set("16",JSON.stringify(siMaYi_json));
    var xiaHouDun_json = {"hero_id":17,"full_blood":4,"power":["刚烈"],"country":"wei","sex":"male","name":"夏侯惇"};
    heroStorage.set("17",JSON.stringify(xiaHouDun_json));
    var zhangLiao_json = {"hero_id":18,"full_blood":4,"power":["突袭"],"country":"wei","sex":"male","name":"张辽"};
    heroStorage.set("18",JSON.stringify(zhangLiao_json));
    var xuChu_json = {"hero_id":19,"full_blood":4,"power":["裸衣"],"country":"wei","sex":"male","name":"许褚"};
    heroStorage.set("19",JSON.stringify(xuChu_json));
    var guoJia_json = {"hero_id":20,"full_blood":3,"power":["天妒","遗计"],"country":"wei","sex":"male","name":"郭嘉"};
    heroStorage.set("20",JSON.stringify(guoJia_json));
    var zhenJi_json = {"hero_id":21,"full_blood":3,"power":["倾国","洛神"],"country":"wei","sex":"female","name":"甄姬"};
    heroStorage.set("21",JSON.stringify(zhenJi_json));

    var huaTuo_json = {"hero_id":22,"full_blood":3,"power":["急救","青囊"],"country":"qun","sex":"male","name":"华佗"};
    heroStorage.set("22",JSON.stringify(huaTuo_json));
    var lvBu_json = {"hero_id":23,"full_blood":4,"power":["无双"],"country":"qun","sex":"male","name":"吕布"};
    heroStorage.set("23",JSON.stringify(lvBu_json));
    var diaoChan_json = {"hero_id":24,"full_blood":3,"power":["离间","闭月"],"country":"qun","sex":"female","name":"貂蝉"};
    heroStorage.set("24",JSON.stringify(diaoChan_json));

    heroStorage.save();
};

Hero.prototype.wrapJsonStorage  = function(name){
    var ls = localStorage, lo = ls.getItem(name) || '{}';
    try {
        lo = JSON.parse(lo);
        //判断lo是否是对象
        lo = Object(lo) === lo ? lo : {};
    } catch(e) {
        lo = {};
    }
    return {
        has: function(attr) {
            return !!lo[attr];
        },
        get: function(attr) {
            return lo[attr];
        },
        set: function(attr, val) {
            lo[attr] = val;
            return this;
        },
        remove: function(attr) {
            delete lo[attr];
            return this;
        },
        clear: function() {
            lo = {};
            return this;
        },
        save: function() {
            //lo为空时则删除localStorage
            if(this.size() > 0) {
                ls.setItem(name, JSON.stringify(lo));
            } else {
                ls.removeItem(name);
            }
            return this;
        },
        size: function() {
            return Object.keys(lo).length;
        },
        toJSON: function() {
            var o = {}, i;
            for(i in lo) {
                o[i] = lo[i];
            }
            return o;
        },
        toString: function() {
            return JSON.stringify(lo);
        }
    };
};