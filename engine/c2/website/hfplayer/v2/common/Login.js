function Login(){
    var self = this;
    this.loginCallBack;
    this.loginInitBack;
    //获取用户信息（只是登录时的首信息）
    this.getUserInfo =function () {
        if(commonPlayer.platform == 0){
            return window.parent.$("#data").data("user");
        }else{
            return $("#data").data("user");
        }
    };
    this.init = function(callBack){
        this.loginInitBack = callBack;
        if(mark.ANDROID){
            //盒子 的uid
            if(typeof window.org_box == 'undefined'){

            }else{
                //ToDo:获取接口
                var androidLoginStatus = window.org_box.GetLoginStatus();
                if(androidLoginStatus){
                    //用户uid
                    commonPlayer.userInfos.uid = parseInt( window.org_box.GetUid());
                    //用户等级
                    commonPlayer.userInfos.vip_level = parseInt(window.org_box.GetAllMoney()/100);
                    commonPlayer.loginStatus = true;
                    setTimeout(function () {
                        commonPlayer.login.getFlower(function () {
                            //打赏回来，刷新界面
                            self.loginInitBack&&self.loginInitBack();
                        });
                    },1500);
                }else{
                    commonPlayer.userInfos.uid = 0;
                    commonPlayer.userInfos.vip_level = 0;
                    commonPlayer.loginStatus = false;
                    commonPlayer.flower = {
                        fresh_flower_num:0, //真实的花
                        num:0, //总花数
                        sum:0,//总花数（包括分享的.5的花）
                        tanhua_flower_num:0,//昙花
                        wild_flower_num:0 //野花*/
                    };
                    self.loginInitBack&&self.loginInitBack();
                }


                //完成后
                return;
            }
            self.loginInitBack&&self.loginInitBack();
            //盒子 的花  看下面！！aBoxShareCallBack方法
        }else if(mark.WEB){
            this.getUser();
        }else if(mark.IOS){
			commonPlayer.userInfos.uid = window["iOSinfo"].uid;
            commonPlayer.loginStatus = true;
            self.setiOSFlowerInfo();
            self.loginInitBack&&self.loginInitBack();
        }else{
            //没有值的时候按照h5处理
            this.getUser();
        }
    };
    this.setiOSFlowerInfo = function () {
        if(window["iOSinfo"]){
            commonPlayer.flower = {
                fresh_flower_num:window["iOSinfo"].fresh_flower_num, //真实的花
                num:window["iOSinfo"].num, //总花数
                sum:window["iOSinfo"].sum,//总花数（包括分享的.5的花）
                tanhua_flower_num:window["iOSinfo"].tanhua_flower_num,//昙花
                wild_flower_num:window["iOSinfo"].tanhua_flower_num //野花*/
            };//
        }else{
            commonPlayer.flower = {
                fresh_flower_num:0, //真实的花
                num:0, //总花数
                sum:0,//总花数（包括分享的.5的花）
                tanhua_flower_num:0,//昙花
                wild_flower_num:0 //野花*/
            };//
        }
    };
    this.midLogin = function(callBack){
        if(mark.WEB){
            //调起登录
            window.parent.asUserOperate.userLogin();
        }else if(mark.ANDROID){
            if(typeof window.org_box == 'undefined'){

            }else{

                var a=window.org_box.GetLoginStatus(); //盒子的登录状态
                if(!a){
                    window.org_box.newMenuLogin(!commonPlayer.isVertical);
                }
                return;
            }
        }else{
            $(".ssologin")[0].click();
        }
        self.loginCallBack = callBack;
    };
    //替换用户信息
    this.getUser = function(){
        var userInFo = this.getUserInfo();
        if(userInFo){
            commonPlayer.userInfos = userInFo;
            commonPlayer.userInfos.uid = parseInt(userInFo.uid);
            if(commonPlayer.userInfos.uid > 0){
                commonPlayer.loginStatus = true;
                this.getFlower(function(){
                    self.loginInitBack&&self.loginInitBack();
                })
            }else{
                commonPlayer.loginStatus = false;
                commonPlayer.userInfos.uid = 0;
                self.loginInitBack&&self.loginInitBack();
            }
        }else{
            commonPlayer.loginStatus = false;
            commonPlayer.userInfos.uid = 0;
            self.loginInitBack&&self.loginInitBack();
        }
    };
    this.clearUserInfo = function(){
        commonPlayer.userInfos={
            uid:0,//用户uid
            uname:"", //昵称
            account_info:"",
            account_type:"",
            angel_logo:0,
            author_level:"",
            avatar:"",
            client_type:"",
            email:"",
            login_type:"",
            mobile:"",
            nick_name:"",
            nick_name_set:0,
            regdate:"",
            screen_game_ad:0,
            screen_scroll_ad:0,
            session_loginday:"",
            status:"",
            super_title:"",
            temp_vip_end_time:"",
            temp_vip_level:"",
            user_exp:"",
            user_level:"",
            username:"",
            vip_level:""
        };
        commonPlayer.flower = {
            fresh_flower_num:0, //真实的花
            num:0, //总花数
            sum:0,//总花数（包括分享的.5的花）
            tanhua_flower_num:0,//昙花
            wild_flower_num:0 //野花*/
        };//
        commonPlayer.loginStatus = false;

    };
    //获取鲜花
    this.getFlower = function(callBack){
        var url;
        if(mark.ANDROID){
            if(window["org_box"]){
                var token = "";
                if(window["org_box"].GetLoginStatus()){
                    token = window["org_box"].GetLoginToken();
                }
                //http://www.66rpg.com/api/client?pack_name=main.opalyer&token=470b3680f8efd8e8534ca4d312278ce0&action=game_flower_by_me&nt=wifi&gindex=495280&device_code=SMG9208&skey&channel=t&sv=NRD90M.G9208ZMU2EQG3
                url  = GAME_PATH.GAT_ABOX_FLOWER_BY_ME+"?pack_name=h5&" +
                    "token="+token+"&" +
                    "action=game_flower_by_me&"+
                    "nt=&" +
                    "gindex="+gIndex+"&" +
                    "channel=&" +
                    "sv="
            }
        }else{
            url=GAME_PATH.FLOWER_GAME_ALL_FLOWER+"?gindex="+gIndex;
        }
        if(!url){
            return;
        }
        getAjax(url,"get",null, function (result) {
            if(result.status == 1){
                commonPlayer.flower = result.data;
                callBack&&callBack();
            }else{
                callBack&&callBack(-1);
                console.log("获取花失败")
            }
        }, function (data) {
            callBack&&callBack(-1);
            console.log("获取花失败+error")
        },true);
    };
}
commonPlayer.login = new Login(); //登录

//登录成功回调
loginSuc = function(){//
    // if(commonPlayer.login.loginCallBack){
        commonPlayer.login.init(function(){ //从新初始化用户信息，花
            if(!commonPlayer.channel_id&&mark.WEB){
                if(typeof WebUserLoginIn != "undefined")WebUserLoginIn();
            }
            if(GetQueryString("isCgMenu")=="true"){
                //菜单初始化  h5/debug用
                if(commonPlayer.userInfos.uid&&commonPlayer.userInfos.uid>0){
                    commonPlayer.countServer.gamePlayTime(commonPlayer.userInfos.uid,gIndex);
                    if(typeof changeAjaxData != "undefined"){
                        changeAjaxData();
                    }
                    if(typeof WebUserChangeData != "undefined"){
                        WebUserChangeData();
                    }
                }else{
                    if(typeof changeAjaxData != "undefined"){
                        changeAjaxData();
                    }
                    if(typeof WebUserChangeData != "undefined"){
                        WebUserChangeData();
                    }
                }
            }else{
                //主站用
                commonPlayer.gameMenu.get_Menu_state(function(){//重新初始化菜单数据
                    //菜单初始化
                    if(commonPlayer.userInfos.uid&&commonPlayer.userInfos.uid>0){
                        commonPlayer.countServer.gamePlayTime(commonPlayer.userInfos.uid,gIndex);
                        if(typeof changeAjaxData != "undefined"){
                            changeAjaxData();
                        }
                        if(typeof WebUserChangeData != "undefined"){
                            WebUserChangeData();
                        }
                    }else{
                        if(typeof changeAjaxData != "undefined"){
                            changeAjaxData();
                        }
                        if(typeof WebUserChangeData != "undefined"){
                            WebUserChangeData();
                        }
                    }
                })
            }

        });
    // }
};
//退出回调
loginOut = function(){
    //用户退出了===用户没有登录
    console.log("登录退出");
    //清空花和用户信息
    commonPlayer.login.clearUserInfo();//清空用户信息
    commonPlayer.gameMenu.clearMenuState(); //清空点赞打赏状态
    commonPlayer.countServer.gamePlayTime();
    if(!commonPlayer.channel_id&&mark.WEB){
        if(typeof WebUserLoginOut != "undefined")WebUserLoginOut();
    }
    if(typeof WebUserChangeData != "undefined"){
        WebUserChangeData();
    }
};
ajaxLoginCall = function () {
    commonPlayer.login.init(function(){
        //if(commonPlayer.userInfos.uid&&commonPlayer.userInfos.uid>0){
        commonPlayer.countServer.getServerTime(function(){
            initGame();
        })
        //}

    })
};
notLoginCall = function(){
    //没有登录进入游戏
    console.log("没有登录进入游戏");
    commonPlayer.login.init(function(){
       $(function(){
           commonPlayer.countServer.getServerTime(function(){
               initGame();
           })
       });
    })
}


//初始化登录----盒子在线玩。 //初始化登录----盒子在线玩。
function aBoxShareCallBack(a,half){
    //toDo:获取接口花
    // //获取完成后
    if(mark.ANDROID){
        if(half != "half"){
            ajaxLoginCall();
        }else{
            setTimeout(function () {
                commonPlayer.login.getFlower(function () {
                    //打赏回来，刷新界面
                    WebUserChangeData&&WebUserChangeData();
                });
            },1500);
        }
        return;
    }
    var flowerSum = ''+a;
    var flowerArrSum=flowerSum.split("|");
    if(!a){
        commonPlayer.flower.num = 0;
    }else{
        commonPlayer.flower.num = parseInt(flowerArrSum[0]);
    }
    try{
        if(flowerArrSum.length>1){
            commonPlayer.flower.num = parseInt(flowerArrSum[0]);
            commonPlayer.flower.fresh_flower_num = parseInt(flowerArrSum[1]);
            commonPlayer.flower.wild_flower_num = parseInt(flowerArrSum[2]);
            commonPlayer.flower.tanhua_flower_num = parseInt(flowerArrSum[3]);
            commonPlayer.flower.sum = parseFloat(flowerArrSum[4]);
        }
    }catch(e){
        alert("getFlower Error:"+e);
    }
    //花给了 不是中途登录；
    if(half != "half"){
        ajaxLoginCall();
    }
}
/*
 * a:野花数量
 * 盒子中途登录：
 * */
function aBoxMidFlowerCallBack(a){
    aBoxShareCallBack(a,"half");
    //盒子中途登录成功
    loginSuc();
}
function SCUIExternalGoBack() {
    UIManager.getInstance().externalClose();
}

