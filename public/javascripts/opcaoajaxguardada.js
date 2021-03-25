function calculate_age(datanasc) { 
    var diff_ms = Date.now() - new Date(datanasc);
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

$(document).ready(function(){
    $("#tableResultadoPesquisa tbody tr").on("click", function(){
        var tdsdarow = $(this).children("td");
        //tdsdaRow é um componente html, pra pegar o conteudo preciso fazer innerText
        var colunamatricula = tdsdarow[0].innerText;
        var data = {}; //Json chamado "data" (dados em inglês), é o JSON que será enviado no ajax para /home/pesquisa
        data.matricula = colunamatricula; //esse data.matricula será acessível depois lá no routes de home/pesquisa, estará anexado ao req.body com o nome req.body.matricula
        $.ajax({
            url: '/home/pesquisa',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(umpolicial){
                var idade = calculate_age(umpolicial.datadenascimento);
                umpolicial.idade = idade;
                console.log(umpolicial);
                document.getElementById("divdosdados").setAttribute("class", "");
                document.getElementById("nomespan").innerText = umpolicial.postograd + " " + umpolicial.nomedeguerra;
                document.getElementById("idadespan").innerText = umpolicial.idade;
                document.getElementById("sexospan").innerText = umpolicial.sexo;
            }
        });
        $("#resultadoPesquisa").hide(500);
       
        });
    
});
    
