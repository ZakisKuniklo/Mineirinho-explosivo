var tamanho    
var qtbombas
var modo
var tabuleiro = []
var bombas = []
var tabela
var matrix_uncovered = []
var contagem = 0
var terminou = false
var pontuacao

function criar_grid()
{
    for (var i = 0; i < tamanho; i++)
    {
        tabuleiro.push([])
        matrix_uncovered.push([])
        for (var j = 0; j < tamanho; j++)
        {
            tabuleiro[i].push(0)
            matrix_uncovered[i].push(null)
        }
    }
}

function colocar_bombas()
{
    var contador_bombas = 0
    while (contador_bombas < qtbombas)
    {
        var x = Math.floor(Math.random() * tamanho)
        var y = Math.floor(Math.random() * tamanho)
        if (tabuleiro[x][y] == 0)
        {
            tabuleiro[x][y] = 'B'
            bombas.push([x, y])
            contador_bombas++
        }
    }
}

function colocar_numeros()
{
    for (var i = 0; i < bombas.length; i++)
    {
        var x = bombas[i][0]
        var y = bombas[i][1]
        var adj = [
                    [x-1, y-1], [x-1, y], [x-1, y+1],
                    [x, y-1],               [x, y+1],
                    [x+1, y-1], [x+1, y], [x+1, y+1],
                ]
        for (var j = 0; j < adj.length; j++)
        {
            var x1 = adj[j][0]
            var y1 = adj[j][1]
            if (x1 >= 0 && x1 < tamanho)
            {
                if (y1 >= 0 && y1 < tamanho)
                {
                    if (tabuleiro[x1][y1] !== 'B')
                    {
                        tabuleiro[x1][y1]++
                    }
                }
            }
        }
    }
}

function criar_html()
{
    document.getElementById("timerpt").innerHTML= '<span id="hour">00</span>:<span id="minute">00</span>:<span id="second">00</span> <br>'
    
    var btntrapaca = document.createElement('input')
    document.getElementById('timerpt').appendChild(btntrapaca)
    btntrapaca.setAttribute('type', 'button')
    btntrapaca.setAttribute('value', 'Trapaça')
    btntrapaca.setAttribute('onmousedown', 'trapaca()')
    btntrapaca.setAttribute('onmouseup', 'undo_trapaca()')

    pontuacao = document.createElement('h3')
    document.getElementById('timerpt').appendChild(pontuacao)
    pontuacao.innerHTML="pontuação: 0"


    tabela = document.createElement('table')
    tabela.className = 'tabuleiro'
    tabela.id = 'tabela'
    tabela.style.width = tamanho * 40 + 'px'
    document.getElementById('tabuleiro').appendChild(tabela)
    for (var i = 0; i < tamanho; i++)
    {
        var linha = document.createElement('tr')
        linha.className = 'tabuleiro'
        tabela.appendChild(linha)
        for (var j = 0; j < tamanho; j++)
        {
            var celula = document.createElement('td')
            celula.className = 'tabuleiro'
            celula.setAttribute('onclick', 'revelar(this)')
            linha.appendChild(celula)
        }
    }
}

function revelar(celula)
{
    if(!terminou){
        var x = celula.cellIndex
        var y = celula.parentNode.rowIndex
        var valor = tabuleiro[x][y]
        var adj = [
            [x - 1, y - 1], [x - 1, y], [x - 1, y + 1],
            [x, y - 1], [x, y + 1],
            [x + 1, y - 1], [x + 1, y], [x + 1, y + 1],
        ]

        if(celula.innerText == "" || celula.innerText == null){
            celula.innerHTML = valor
            celula.style.backgroundImage = "url(images/dirt.png)"
            celula.style.borderColor = "rgb(88 61 40)"
            matrix_uncovered[x][y] = valor
            vitoria(celula)
            if (valor == 0) {
                for (var i = 0; i < adj.length; i++) {
                    var x1 = adj[i][0]
                    var y1 = adj[i][1]

                    if (x1 >= 0 && x1 < tamanho) {
                        if (y1 >= 0 && y1 < tamanho) {
                            var celula_adj = tabela.rows[y1].cells[x1]
                            if (matrix_uncovered[x1][y1] == null) {
                                revelar(celula_adj)
                            }
                        }
                    }
                }
            }
        }
     }
}

function trapaca()
{
  if(!terminou){
    for (var i = 0; i < tamanho; i++)
    {
        for (var j = 0; j < tamanho; j++)
        {
            tabela.rows[j].cells[i].innerHTML = tabuleiro[i][j]
        }
    }
  }

}

function undo_trapaca()
{
  if(!terminou){
    for (var i = 0; i < tamanho; i++)
    {
        for (var j = 0; j < tamanho; j++)
        {
            tabela.rows[j].cells[i].innerHTML = matrix_uncovered[i][j]
        }
    }
  }  
}

function comecar()
{
    tamanho = document.getElementById('grid').value
    qtbombas = document.getElementById('qtbombas').value
    modo = document.getElementById('modo').value
    document.getElementById('interface').remove()
    criar_grid()
    colocar_bombas()
    colocar_numeros()
    criar_html()
    start()
}

function change()
{
    var inputb = document.getElementById('qtbombas')
    var inputg = document.getElementById('grid')
    inputb.value = null
    inputb.min = Math.ceil(inputg.value*inputg.value*0.2)
    inputb.max = Math.ceil(inputg.value*inputg.value*0.25)
    inputb.value = Math.ceil(inputg.value * inputg.value * 0.2)
}


function vitoria(celula)
{
    if(celula.innerHTML != 'B'){
        contagem = contagem + 1
        pontuacao.innerHTML = "pontuação: " + contagem
        if(contagem >= ((tamanho*tamanho)-qtbombas)){
            terminar("Você ganhou")
        }
    }else{
        terminar("Você perdeu")
    }
}

function terminar(msg){
    var vitoria = document.createElement('h2')
    document.getElementById('tabuleiro').appendChild(vitoria)
    vitoria.innerHTML = msg
    terminou = true
    verbombas()
    pause()
    btnRecomecar()
}

function btnRecomecar(){
    var recomecar = document.createElement('input')
    document.getElementById('tabuleiro').appendChild(recomecar)
    recomecar.setAttribute('type', 'button')
    recomecar.setAttribute('value', 'nova partida')
    recomecar.setAttribute('onclick', 'location.reload()')
}


function verbombas() {
    for (var i = 0; i < tamanho; i++) {
        for (var j = 0; j < tamanho; j++) {
            if (tabuleiro[i][j] == 'B'){
                tabela.rows[j].cells[i].innerHTML = tabuleiro[i][j]
            }
        }
    }
}


var hour = 0;
var minute = 0;
var second = 0;
var millisecond = 0;

var cron;

function start() {
  pause();
    if (modo == "Rivotril") {
        minute = Math.ceil( 0.2 * tamanho)
        cron = setInterval(() => { timer(); }, 10);
    }else{
        cron = setInterval(() => { cronometro(); }, 10);
    }
}

function pause() {
  clearInterval(cron);
}


function cronometro() {
  if ((millisecond += 10) == 1000) {
    millisecond = 0;
    second++;
  }
  if (second == 60) {
    second = 0;
    minute++;
  }
  if (minute == 60) {
    minute = 0;
    hour++;
  }
  document.getElementById('hour').innerText = returnData(hour);
  document.getElementById('minute').innerText = returnData(minute);
  document.getElementById('second').innerText = returnData(second);
}

function returnData(input) {
  return input > 10 ? input : `0${input}`
}

function timer() {
    
    if (hour <= 0 && minute <= 0 && second <= 0) {
        terminar("Tempo esgotado")
    }
    
    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second--;
    }
    if (second <= 00 && minute >0) {
        second = 59;
        minute--;
    }
    if (minute == 00 && hour>0) {
        minute = 59;
        hour --;
    }
    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
}
