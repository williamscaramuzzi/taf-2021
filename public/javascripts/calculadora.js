function distribuicaoMasculina(idade){
    var pontos = 10.0;
    if(idade<26) pontos+=0; else 
    if(idade>25 && idade<31) pontos+=1;else
    if(idade>30 && idade<36) pontos+=2;else
    if(idade>35 && idade<41) pontos+=4;else
    if(idade>40 && idade<46) pontos+=5;else
    if(idade>45 && idade<51) pontos+=7;else
    if(idade>50) pontos+=8;
    return pontos;
}
function distribuicaoFeminina(idade){
    var pontos = 10.0;
    if(idade<26) pontos+=0; else 
    if(idade>25 && idade<31) pontos+=0.5;else
    if(idade>30 && idade<36) pontos+=1;else
    if(idade>35 && idade<41) pontos+=2;else
    if(idade>40 && idade<46) pontos+=3;else
    if(idade>45 && idade<51) pontos+=5;else
    if(idade>50) pontos+=6;
    return pontos;
}
function corridaMasculina(quantidade, idade){
    if(quantidade>2800) return 10;
    if(quantidade<1000) return 0;
    //36 linhas na tabela, 36 índices no vetor
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 2800; index > 999; index=index-50) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }
    //Math.floor arredonda pra baixo. Como eu quero múltiplos de 50, eu arredondo a divisão, depois multiplico de novo por 50
    //por exemplo: 125/50 dá 2,5.... com o math.floor, isso vira 2. Multiplicando por 50 tenho 100, que é o arredondamento pra baixo (floor) múltiplo de 50
    return mapQuantidade.get(Math.floor(quantidade/50)*50);
}


function corridaFeminina(quantidade, idade){
    if(quantidade>2200) return 10;
    if(quantidade<700) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index = 2200; index > 699; index=index-50) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(Math.floor(quantidade/50)*50);
}


function flexaoMasculina(quantidade, idade){
    if(quantidade>27) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 27; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }
    return mapQuantidade.get(quantidade);
}


function flexaoFeminina(quantidade, idade){
    if(quantidade>24) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index = 24; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(quantidade);
}


function barras(quantidade, idade){
    if(quantidade>12) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index = 12; index >= 0; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else{mapQuantidade.set(index, pontos);}
        pontos-=0.5;
        if(pontos<1) pontos =0;
    }    
    return mapQuantidade.get(quantidade);
}


function abdominalMasculino(quantidade, idade){
    if(quantidade>49) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoMasculina(idade);
    for (let index=49; index >=47; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
    }
    for (let index = 46; index > 30; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2!=0) pontos-=0.5; //se index é ímpar, aí decrementa
    }    
    if(pontos>=10){
        mapQuantidade.set(30, 10);
        mapQuantidade.set(29, 10);
    } else{
        mapQuantidade.set(30, pontos);
        mapQuantidade.set(29, pontos);}

    for (let index = 28; index >= 20; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2==0) pontos-=0.5; //se index é par, aí decrementa
    }
    for(let index=19; index>0; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else 
        {mapQuantidade.set(index, pontos);}
        pontos-=0.5; 
    }
    return mapQuantidade.get(quantidade);
}


function abdominalFeminino(quantidade, idade){
    if(quantidade>38) return 10;
    if(quantidade<1) return 0;
    var mapQuantidade = new Map();
    var pontos = distribuicaoFeminina(idade);
    for (let index=38; index >=36; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        pontos-=0.5;
    }
    for (let index = 35; index > 30; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index==34) pontos-=0.5;
    }

    for (let index = 30; index >= 26; index--) {
        if(pontos>10){mapQuantidade.set(index, 10);}
        else {mapQuantidade.set(index, pontos);}
        if(index%2==0) pontos-=0.5; //se index é par, aí decrementa
    }
    for(let index=25; index>=3; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else
        {mapQuantidade.set(index, pontos);}
        pontos-=0.5; 
    }
    for(let index=2; index>=0; index--){
        if(pontos>10){mapQuantidade.set(index, 10);}else 
        if(pontos<1){mapQuantidade.set(index, 0);}else
        {mapQuantidade.set(index, pontos);}
    }    
    return mapQuantidade.get(quantidade);
}

function chamaAbdominais(){
    var sexo = $("#sexospan").text();        
    var idade = $("#idadespan").text();    
    var quantidade = parseInt($("#qtdAbs").val());    
    var resultado = 0;
    if(sexo=="feminino") resultado = abdominalFeminino(quantidade, idade);
    if(sexo=="masculino") resultado = abdominalMasculino(quantidade, idade);
    $("#pontAbInput").val(resultado);
}
function chamaCorrida(){
    var sexo = $("#sexospan").text();        
    var idade = $("#idadespan").text();    
    var quantidade = parseInt($("#qtdCorrida").val());    
    var resultado = 0;
    if(sexo=="feminino") resultado = corridaFeminina(quantidade, idade);
    if(sexo=="masculino") resultado = corridaMasculina(quantidade, idade);
    $("#pontCorridaInput").val(resultado);
}
function chamaBarra(){
    var idade = $("#idadespan").text();    
    var quantidade = parseInt($("#barraInputText").val());    
    var resultado = barras(quantidade, idade);
    $("#pontBarraInput").val(resultado);
}
function chamaBarraDosVeio(){
    var idade = $("#idadespan").text();    
    var quantidade = parseInt($("#qtdBarrasOpcao").val());    
    var resultado = barras(quantidade, idade);
    $("#pontBarraDosVeioInput").val(resultado);
}
function chamaFlexao(){
    var sexo = $("#sexospan").text();    
    var idade = $("#idadespan").text();    
    var quantidade = 0;
    var resultado = 0;
    if(sexo=="feminino") {
        quantidade = parseInt($("#flexaoFemInputText").val());
        resultado = flexaoFeminina(quantidade, idade);
        $("#pontFlexaoFemInput").val(resultado);
    }
    if(sexo=="masculino") {
        quantidade = parseInt($("#qtdFlexaoOpcao").val());
        resultado = flexaoMasculina(quantidade, idade);
        $("#pontFlexaoMascInput").val(resultado);
    }    
}

function total() {
    var allTextNotHidden = $(":input").not(":hidden");
    var allTextInputReadonly = allTextNotHidden.filter(":input[type=text][readonly='readonly']");
    console.log(allTextInputReadonly);
    var fator1, fator2, fator3, media;
    fator1 = parseFloat(allTextInputReadonly[0].value);
    console.log("fator1: " + fator1);
    fator2 = parseFloat(allTextInputReadonly[1].value);
    console.log("fator2: " + fator2);
    fator3 = parseFloat(allTextInputReadonly[2].value);
    console.log("fator3: " + fator3);
    media = (fator1 + fator2 +fator3)/3;
    alert(media);
}
