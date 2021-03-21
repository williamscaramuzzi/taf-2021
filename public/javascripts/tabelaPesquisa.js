function calculate_age(datanasc) { 
    var diff_ms = Date.now() - new Date(datanasc);
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}
function validar(){
    //checa se o campo de texto nomeMat é nulo e/ou só tem espaços vazios
    if (!document.getElementById("nomeMat").value.replace(/\s/g, '').length) {
        alert("Preencha o campo adequadamente");
        //se é um campo inválido, dá o alert acima e zera o value abaixo
        document.getElementById("nomeMat").value = '';
        return false;
     
    } else return true;
    
}

$(document).ready(function(){
    $("#tableResultadoPesquisa tbody tr").on("click", function(){
        var tdsdarow = $(this).children("td");
        //tdsdaRow é um componente html, pra pegar o conteudo preciso fazer innerText
        var colunamatricula = tdsdarow[1].innerText; //coluna da matricula é a segunda coluna, portanto, índice 1
        var data = {};
        data.matricula = colunamatricula;
        $.ajax({
            url: '/home/pesquisa',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(umpolicial){
                var idade = calculate_age(umpolicial.datadenascimento);
                umpolicial.idade = idade;
                document.getElementById("divdosdados").setAttribute("class", "");
                document.getElementById("nomespan").innerText = umpolicial.postograd + " " + umpolicial.nomedeguerra;
                document.getElementById("matriculaspan").innerText = umpolicial.matricula;
                document.getElementById("unidadespan").innerText = umpolicial.unidade;
                document.getElementById("idadespan").innerText = umpolicial.idade;
                document.getElementById("sexospan").innerText = umpolicial.sexo;
                if(umpolicial.sexo=='feminino'){
                    document.getElementById("divdotaf").setAttribute("class", "");
                    $("#rowDasBarras").hide();
                    $("#rowDasOpcoes").hide();
                    $("#rowDasFlexoesFem").show();
                };
                if(umpolicial.sexo=='masculino'){
                    if(umpolicial.idade>35){
                        document.getElementById("divdotaf").setAttribute("class", "");
                        /*mostrar opçao barra/flexao
                        esconder rowdasbarras*/
                        $("#rowDasOpcoes").show();
                        $('#rowDasBarras').hide();
                        $('#rowDasFlexoesFem').hide();
                    } else {
                        document.getElementById("divdotaf").setAttribute("class", "");
                        /*esconder opção barra/flexao
                        mostrar so barra*/
                        $('#rowDasFlexoesFem').hide();
                        $("#rowDasOpcoes").hide();
                        $('#rowDasBarras').show();
                    }
                }
                var mes = new Date().getMonth();
                if(mes<7) { 
                    document.getElementById("1sem").setAttribute("selected", true);
                }
                else {                  
                    document.getElementById("2sem").setAttribute("selected", true);
                }
                
            }
        });
        $("#resultadoPesquisa").hide(500);
       
        });

        $("#barraRadioButton").on("click", function(){
            $(".tdbarra").show();            
            $(".tdflexao").hide();
            $("#qtdFlexaoOpcao").val("");
            $("#pontFlexaoMascInput").val("");
        });
        $("#flexaoRadioButton").on("click", function(){
            $(".tdflexao").show();
            $(".tdbarra").hide();
            $("#qtdBarrasOpcao").val("");
            $("#pontBarraDosVeioInput").val("");
        });
      
});
