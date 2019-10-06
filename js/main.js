enchant()

///window.onload = function(){

function Load(width,height){
  var core = new Core(width, height);
  core.preload("image/Reversi.png","image/Set_button.png","image/stone.png","image/Hand.png","image/V_or_D.png");
  core.fps = 10;
  core.onload = function(){

    var AI = 100;//AIの先攻後攻設定
    var okerutenmetu = 0;//置ける場所の表示
    var kazutenmetu = 0;//置ける場所にひっくり返る数表示
    var Time_Start = 0;
    var bamen = 0;
    var Intiki = false;

    var va = 1;
    var te = 1;
    var Kagayaki = 1;
    var Time = 0;
    var Time_Hand = 5;
    var Time_R_ensyutu = 0;
    var Time_Kagayaki = 0;
    var Black_Number = 0;
    var White_Number = 0;

    var Pointer = new Sprite(1,1);
    Pointer.image = core.assets["image/Hand.png"];

    var Reversi = new Sprite(405,405);
    Reversi.image = core.assets["image/Reversi.png"];
    Reversi.x = 0;
    Reversi.y = 40;
    core.rootScene.addChild(Reversi);

    var Set_button = new Sprite(195,95);
    Set_button.image = core.assets["image/Set_button.png"];
    Set_button.x = 105;
    Set_button.y = 195;
    core.rootScene.addChild(Set_button);

    var Set_button1 = new Sprite(195,95);
    Set_button1.image = core.assets["image/Set_button.png"];
    Set_button1.x = 5;
    Set_button1.y = 295;
    Set_button1.frame = 1;
    core.rootScene.addChild(Set_button1);

    var Set_button2 = new Sprite(195,95);
    Set_button2.image = core.assets["image/Set_button.png"];
    Set_button2.x = 205;
    Set_button2.y = 295;
    Set_button2.frame = 2;
    core.rootScene.addChild(Set_button2);

    var Set_button3 = new Sprite(195,95);
    Set_button3.image = core.assets["image/Set_button.png"];
    Set_button3.x = 105;
    Set_button3.y = 345;
    Set_button3.frame = 9;

    var Stone = Class.create(Sprite, {
      initialize: function(x,y,z) {
        Sprite.call(this, 45, 45);
        this.x = 50*x+5;
        this.y = 50*y+45;
        this.image = core.assets['image/stone.png'];
        //core.rootScene.addChild(this);
        this.ura = z;
        if(z==3) z = 1;
        this.frame = z;
      }
    });

    var text = Class.create(Label, {
      initialize: function(x,y,ward) {
        Label.call(this);
        this.x = 50*x+5;
        this.y = 50*y+45;
        this.color = 'red';
        this.font = '20px "Arial"';
        this.on('enterframe', function(){
          this.text = (ward);
        });
      }
    });

    var Stones = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];
    var uragaerukazu = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];

    var urahyouzi = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];

    var priority = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];

    var priority_cat = [
      [-300,-20,-20,-20,-20,-20,-20,-300],
      [-20,1,-1,-1,-1,-1,1,-20],
      [-20,-1,-1,-1,-1,-1,-1,-20],
      [-20,-1,-1,-1,-1,-1,-1,-20],
      [-20,-1,-1,-1,-1,-1,-1,-20],
      [-20,-1,-1,-1,-1,-1,-1,-20],
      [-20,1,-1,-1,-1,-1,1,-20],
      [-300,-20,-20,-20,-20,-20,-20,-300]
    ];

    var priority_otter = [
      [3,2,2,2,2,2,2,3],
      [2,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,2],
      [2,1,1,1,1,1,1,2],
      [3,2,2,2,2,2,2,3]
    ];

    var priority_people = [
      [ 30,-12,  0, -1, -1,  0,-12, 30],
      [-12,-15, -3, -3, -3, -3,-15,-12],
      [  0, -3,  0, -1, -1,  0, -3,  0],
      [ -1, -3, -1, -1, -1, -1, -3, -1],
      [ -1, -3, -1, -1, -1, -1, -3, -1],
      [  0, -3,  0, -1, -1,  0, -3,  0],
      [-12,-15, -3, -3, -3, -3,-15,-12],
      [ 30,-12,  0, -1, -1,  0,-12, 30]
    ];

    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
        var z = Stones[y][x];
        Stones[y][x] = new Stone(x,y,z);
        var z = uragaerukazu[y][x];
        urahyouzi[y][x] = new text(x,y,z);
      }
    }

    var Hand = new Sprite(280,370);
    Hand.image = core.assets["image/Hand.png"];

    /*var label = new Label();
    label.x = 5;
    label.y = 5;
    label.color = 'black';
    label.font = '40px "Arial"';
    label.on('enterframe', function(){
      label.text = (Time_R_ensyutu);
    });
    core.rootScene.addChild(label);*/

    var label1 = new Label();
    label1.x = 5;
    label1.y = 5;
    label1.color = 'black';
    label1.font = '40px "Arial"';
    label1.on('enterframe', function(){
      if(va==1) var van = "黒の番";
      if(va==2) var van = "白の番";
      if(va==3){
        var van = "";
        W_D();
      }
      label1.text = (van);
    });
    //core.rootScene.addChild(label1);

    var label2 = new Label();
    label2.x = 155;
    label2.y = 20;
    label2.color = 'black';
    label2.font = '20px "Arial"';
    label2.on('enterframe', function(){
      kazoeru();
      var van = "黒"+Black_Number;
      label2.text = (van);
    });
    //core.rootScene.addChild(label2);

    var label3 = new Label();
    label3.x = 205;
    label3.y = 20;
    label3.color = 'black';
    label3.font = '20px "Arial"';
    label3.on('enterframe', function(){
      kazoeru();
      var van = "白"+White_Number;
      label3.text = (van);
    });
    //core.rootScene.addChild(label3);

    var label4 = new Label();
    label4.x = 255;
    label4.y = 20;
    label4.color = 'black';
    label4.font = '20px "Arial"';
    label4.on('enterframe', function(){
      if(va==3) var van = "";
      else var van = te + "手目";
      label4.text = (van);
    });
    //core.rootScene.addChild(label4);

    function kazoeru(){
      Black_Number = 0;
      White_Number = 0;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          if(Stones[y][x].ura==1) Black_Number++;
          if(Stones[y][x].ura==2) White_Number++;
        }
      }
    }

    function bankirikae(){
      if(va==1||va==10) va = 2;
      else if(va==2||va==20) va = 1;
      else ;
    }

    function hyouzisuru(){
      bamen = 3;
      te = 1;
      Pointer.y     = 0;
      Set_button.y  = 500;
      Set_button1.y = 500;
      Set_button2.y = 500;
      core.rootScene.removeChild(Pointer);
      core.rootScene.removeChild(Set_button);
      core.rootScene.removeChild(Set_button1);
      core.rootScene.removeChild(Set_button2);
      core.rootScene.removeChild(Set_button3);
      core.rootScene.addChild(label1);
      core.rootScene.addChild(label2);
      core.rootScene.addChild(label3);
      core.rootScene.addChild(label4);
      reset();
      va = 1;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          core.rootScene.addChild(Stones[y][x]);
        }
      }
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          operating(x,y,va);
        }
      }
    }

    Reversi.addEventListener("enterframe",function(){//常に動く
      if(bamen==0) return;
      if(Time_Hand>5) core.rootScene.removeChild(Hand);
      if(va==AI&&Time_Hand>10) AI_dousa(); //AIが置くまでの時間
      if(Time_R_ensyutu>0) Time_R_ensyutu = 0;
      Time++;
      Time_R_ensyutu++;
      Time_Hand++;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          Flashing(x,y);
        }
      }
      Time_Kagayaki = Time_Kagayaki+0.2*Kagayaki;
      if(Time_Kagayaki>=0.8||Time_Kagayaki<=0.01) Kagayaki = Kagayaki*(-1);
    })

    function  Flashing(x,y){
      core.rootScene.addChild(Pointer);
      Pointer.x = 0;
      Pointer.y = 0;
      core.rootScene.removeChild(Pointer);
      if(Stones[y][x].ura==3){
        if(Time_R_ensyutu>0){
          if(va==AI) var aw = 1;//AIの時は演出カット = 0
          else var aw = 1;
          Stones[y][x].opacity = Time_Kagayaki*aw*okerutenmetu;//置ける場所点滅表示
          urahyouzi[y][x].opacity = 1*aw*kazutenmetu;//置ける数表示
        }
        else{
          Stones[y][x].opacity = 0;
          urahyouzi[y][x].opacity = 0;//置ける場所点滅表示
        }
      }
      else if(Stones[y][x].ura==10){
        if(Time_R_ensyutu<-5)Stones[y][x].frame = 3;
        else if(Time_R_ensyutu>-5&&Time_R_ensyutu<-3) Stones[y][x].frame = 4;
        else if(Time_R_ensyutu>-3&&Time_R_ensyutu<-1) Stones[y][x].frame = 5;
        else if(Time_R_ensyutu==0){
          Stones[y][x].ura = 1;
          Stones[y][x].frame = 1;
        }
      }
      else if(Stones[y][x].ura==20){
        if(Time_R_ensyutu<-5)Stones[y][x].frame = 6;
        else if(Time_R_ensyutu>-5&&Time_R_ensyutu<-3) Stones[y][x].frame = 7;
        else if(Time_R_ensyutu>-3&&Time_R_ensyutu<-1) Stones[y][x].frame = 8;
        else if(Time_R_ensyutu==0){
          Stones[y][x].ura = 2;
          Stones[y][x].frame = 2;
        }
      }
      else Stones[y][x].opacity = 1;
    }

    function okuugoki(){
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          if(Stones[y][x].intersect(Pointer)&&Stones[y][x].ura==3&&Time>0){//接触
            Time_Hand = 0;
            console.log(te+"手目横"+(x+1)+"縦"+(y+1));
            te++;
            Stones[y][x].ura = va;
            operating(x,y,va,true);
            bankirikae();
            for (var x = 0; x < 8; x++) {
              for (var y = 0; y < 8; y++) {
                operating(x,y,va);
              }
            }
          }
        }
      }
      var okeru = false;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          if(Stones[y][x].ura==3) okeru = true;
        }
      }
      if(okeru==false){
        bankirikae();
        for (var x = 0; x < 8; x++) {
          for (var y = 0; y < 8; y++) {
            operating(x,y,va);
          }
        }
      }
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          if(Stones[y][x].ura==3) okeru = true;
        }
      }
      if(okeru==false) va = 3;
    }

    function reset(){
      va = 2;
      Time = 0;
      Time_Hand = 5;
      Time_R_ensyutu = 0;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          Stones[y][x].ura = 0;
          Stones[y][x].frame = 0;
          if(x==3&&y==3){
            Stones[y][x].ura = 2;
            Stones[y][x].frame = 2;
          }
          if(x==4&&y==4){
            Stones[y][x].ura = 2;
            Stones[y][x].frame = 2;
          }
          if(x==3&&y==4){
            Stones[y][x].ura = 1;
            Stones[y][x].frame = 1;
          }
          if(x==4&&y==3){
            Stones[y][x].ura = 1;
            Stones[y][x].frame = 1;
          }
        }
      }
    }

    function operating(x,y,z,t){
      var ura_kazu = 0;
      var ura_TF = false;
      for(var i = x + 1; i < 8; i++){//右方向
        if(Stones[y][i].ura==0||Stones[y][i].ura==3) break;
        if(Stones[y][i].ura==z){
          ura_TF = true;
          break;
        }
      }
      for(var k = x + 1; k < i; k++){
        if(ura_TF == false) break;
        if(t==true) reber(k,y,z);
        ura_kazu++;
      }//右方向

      var ura_TF = false;
      for(var i = x - 1; i >= 0; i--){//左方向
        if(Stones[y][i].ura==0||Stones[y][i].ura==3) break;
        if(Stones[y][i].ura==z||Stones[y][i].ura==z*10){
          ura_TF = true;
          break;
        }
      }
      for(var k = x - 1; k > i; k--){
        if(ura_TF == false) break;
        if(t==true) reber(k,y,z);
        ura_kazu++;
      }//左方向

      var ura_TF = false;
      for(var i = y - 1; i >= 0; i--){//上方向
        if(Stones[i][x].ura==0||Stones[i][x].ura==3) break;
        if(Stones[i][x].ura==z||Stones[i][x].ura==z*10){
          ura_TF = true;
          break;
        }
      }
      for(var k = y - 1; k > i; k--){
        if(ura_TF == false) break;
        if(t==true) reber(x,k,z);
        ura_kazu++;
      }//上方向

      var ura_TF = false;
      for(var i = y + 1; i < 8; i++){//下方向
        if(Stones[i][x].ura==0||Stones[i][x].ura==3) break;
        if(Stones[i][x].ura==z||Stones[i][x].ura==z*10){
          ura_TF = true;
          break;
        }
      }
      for(var k = y + 1; k < i; k++){
        if(ura_TF == false) break;
        if(t==true) reber(x,k,z);
        ura_kazu++;
      }//下方向

      var k = 1;
      var ura_TF = false;
      for(var i = x + 1; i < 8; i++){//右上方向
        if(y==0) break;
        if(Stones[y-k][i].ura==0||Stones[y-k][i].ura==3) break;
        if(Stones[y-k][i].ura==z||Stones[y-k][i].ura==z*10){
          ura_TF = true;
          break;
        }
        if(y-k==0) break;
        k++;
      }
      var k = 1;
      for(var s = x + 1; s < i; s++){
        if(ura_TF == false) break;
        if(y==0) break;
        if(t==true) reber(s,y-k,z);
        ura_kazu++;
        if(y-k==0) break;
        k++;
      };//右上方向

      var k = 1;
      var ura_TF = false;
      for(var i = x + 1; i < 8; i++){//右下方向
        if(y==7) break;
        if(Stones[y+k][i].ura==0||Stones[y+k][i].ura==3) break;
        if(Stones[y+k][i].ura==z||Stones[y+k][i].ura==z*10){
          ura_TF = true;
          break;
        }
        if(y+k==7) break;
        k++;
      }
      var k = 1;
      for(var s = x + 1; s < i; s++){
        if(ura_TF == false) break;
        if(y==7) break;
        if(t==true) reber(s,y+k,z);
        ura_kazu++;
        if(y+k==7) break;
        k++;
      }//右下方向

      var k = 1;
      var ura_TF = false;
      for(var i = x - 1; i >= 0; i--){//左上方向
        if(y==0) break;
        if(Stones[y-k][i].ura==0||Stones[y-k][i].ura==3) break;
        if(Stones[y-k][i].ura==z||Stones[y-k][i].ura==z*10){
          ura_TF = true;
          break;
        }
        if(y-k==0) break;
        k++;
      }
      var k = 1;
      for(var s = x - 1; s > i; s--){
        if(ura_TF == false) break;
        if(y==0) break;
        if(t==true) reber(s,y-k,z);
        ura_kazu++;
        if(y-k==0) break;
        k++;
      };//左上方向

      var k = 1;
      var ura_TF = false;
      for(var i = x - 1; i >= 0; i--){//左下方向
        if(y==7) break;
        if(Stones[y+k][i].ura==0||Stones[y+k][i].ura==3) break;
        if(Stones[y+k][i].ura==z||Stones[y+k][i].ura==z*10){
          ura_TF = true;
          break;
        }
        if(y+k==7) break;
        k++;
      }
      var k = 1;
      for(var s = x - 1; s > i; s--){
        if(ura_TF == false) break;
        if(y==7) break;
        if(t==true) reber(s,y+k,z);
        ura_kazu++;
        if(y+k==7) break;
        k++;
      }
      if(t==true) return;
      if(ura_kazu>0&&(Stones[y][x].ura==0||Stones[y][x].ura==3)){
        Stones[y][x].ura = 3;
        Stones[y][x].frame = z;
      }
      else {
        if(Stones[y][x].ura==3){
          Stones[y][x].ura = 0;
          Stones[y][x].frame = 0;
        }
      }
      if (Stones[y][x].ura!=0&&Stones[y][x].ura!=3) ura_kazu = 0;
      uragaerukazu[y][x] = ura_kazu;
      if(ura_kazu>0){
        core.rootScene.removeChild(urahyouzi[y][x]);
        urahyouzi[y][x] = new text(x,y,uragaerukazu[y][x]);
        core.rootScene.addChild(urahyouzi[y][x]);
      }
      else {
        core.rootScene.removeChild(urahyouzi[y][x]);
      }
    }

    function operating_AI(){
      var Max = -1000000000;
      for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
          if(uragaerukazu[y][x]==0) continue;
          if(uragaerukazu[y][x]*priority[y][x]>Max){
            Max = uragaerukazu[y][x]*priority[y][x];
            var Max_x = x;
            var Max_y = y;
          }
        }
      }
      if(Max_x>3&&(Hand.frame==0||Hand.frame==1||Hand.frame==2)){
        Hand.frame += 3;
      }
      else if(Max_x<=3&&(Hand.frame==3||Hand.frame==4||Hand.frame==5)){
        Hand.frame -= 3;
      }
      if(Max_x>3&&Hand.frame==6){
        Hand.frame = 8;
      }
      else if(Max_x<=3&&Hand.frame==8){
        Hand.frame = 6;
      }
      return("横"+Max_x+"縦"+Max_y);
    }

    function reber(x,y,z){
      Time_R_ensyutu = -7;
      Stones[y][x].ura = 10*z;
    }

    function AI_dousa(){
      var text = operating_AI();
      x = text.substring(1,2)*1;
      y = text.substring(3,4)*1;
      Hand.x = x*50-230;
      Hand.y = y*50-300;
      if(Hand.frame==3||Hand.frame==4||Hand.frame==5||Hand.frame==8){
        Hand.x += 240;
      }
      core.rootScene.addChild(Hand);
      Pointer.x = x*50+25;
      Pointer.y = y*50+65;
      core.rootScene.addChild(Pointer);
      core.rootScene.removeChild(Pointer);
      okuugoki();
    }

    function W_D(){
        if(Time_R_ensyutu!=0||AI == 100) return;
        var V_or_D = new Sprite(405,405);
        V_or_D.image = core.assets["image/V_or_D.png"];
        V_or_D.x = 0;
        V_or_D.y = 40;
        if(Black_Number>White_Number){
          if(AI == 1)V_or_D.frame = 2;
          if(AI == 2)V_or_D.frame = 1;
        }
        else if(Black_Number<White_Number){
          if(AI == 1)V_or_D.frame = 1;
          if(AI == 2)V_or_D.frame = 2;
        }
        else V_or_D.frame = 3;
        if(Hand.frame==6||Hand.frame==8){
          if(V_or_D.frame==2) V_or_D.frame = 0;
          if(V_or_D.frame==1) V_or_D.frame = 4;
        }
        core.rootScene.addChild(V_or_D);
        console.log(Black_Number);
        console.log(White_Number);
    }

    core.rootScene.on("touchstart",function(e){
      if((Time_Hand>5&&va!=AI)||AI == 100){
        Pointer.x = e.x;
        Pointer.y = e.y;
        core.rootScene.addChild(Pointer);
        core.rootScene.removeChild(Pointer);
        okuugoki();
      }
      if(Set_button.intersect(Pointer)){
        if(bamen==0){
          bamen++;
          Time = 0;
          Set_button.frame  = 3;
          Set_button1.frame = 4;
          Set_button2.frame = 5;
          core.rootScene.addChild(Set_button1);
          core.rootScene.addChild(Set_button2);
        }
        else if(bamen==1&&Time>0) hyouzisuru();
        else if(bamen==2&&Time>0){
          hyouzisuru();
          Hand.frame = 1;
          for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
              priority[y][x] = priority_otter[y][x];
            }
          }
        }
      }
      if(Set_button1.intersect(Pointer)){
        if(bamen==0){
          okerutenmetu = 1;
          core.rootScene.removeChild(Set_button1);
        }
        else if(bamen==1){
          AI = 1;
          bamen++;
          Time = 0;
          Set_button.frame  = 7;
          Set_button1.frame = 6;
          Set_button2.frame = 8;
          Set_button.y = 145;
          Set_button1.x = 105;
          Set_button1.y = 45;
          Set_button2.x = 105;
          Set_button2.y = 245;
          core.rootScene.addChild(Set_button3);
        }
        else if(bamen==2&&Time>0){
          hyouzisuru();
          Hand.frame = 0;
          for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
              priority[y][x] = priority_cat[y][x];
            }
          }
        }
      }
      if(Set_button2.intersect(Pointer)){
        if(bamen==0){
          kazutenmetu = 1;
          core.rootScene.removeChild(Set_button2);
        }
        else if(bamen==1){
          AI = 2;
          bamen++;
          Time = 0;
          Set_button.frame  = 7;
          Set_button1.frame = 6;
          Set_button2.frame = 8;
          Set_button.y = 145;
          Set_button1.x = 105;
          Set_button1.y = 45;
          Set_button2.x = 105;
          Set_button2.y = 245;
          core.rootScene.addChild(Set_button3);
        }
        else if(bamen==2&&Time>0){
          hyouzisuru();
          Hand.frame = 2;
          for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
              priority[y][x] = priority_people[y][x];
            }
          }
        }
      }
      if(Set_button3.intersect(Pointer)&&bamen==2&&Time>0){
        hyouzisuru();
        Stones[0][0].ura = AI;
        Stones[0][0].frame = AI;
        Stones[0][7].ura = AI;
        Stones[0][7].frame = AI;
        Stones[7][0].ura = AI;
        Stones[7][0].frame = AI;
        Stones[7][7].ura = AI;
        Stones[7][7].frame = AI;
        Hand.frame = 6;
        for (var x = 0; x < 8; x++) {
          for (var y = 0; y < 8; y++) {
            priority[y][x] = priority_otter[y][x];
          }
        }
      }
    })

  }
  core.start()
}
