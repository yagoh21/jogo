const personagem = document.getElementById("personagem");
const cenario = document.getElementById("cenario");
const vidas = document.getElementById("vidas");
const moedas = document.getElementById("moedas");
const tempo = document.getElementById("tempo");
const pontos = document.getElementById("pontos");
const botaoReiniciar = document.getElementById("reiniciar");
const botaoIniciar = document.getElementById("iniciar");
const bloco = document.getElementById("bloco");
const inimigo = document.getElementById("inimigo");
const audiojogoinicio = document.getElementById("audiojogoinicio");
const audioesperando = document.getElementById("audioesperando");
const audiopulo = document.getElementById("audiopulo");
const audioMoeda = document.getElementById("audioMoeda");
const audioVidaExtra = document.getElementById("audioVidaExtra");
const audioPerdeuVida = document.getElementById("audioPerdeuVida");
const audioGameOver = document.getElementById("audioGameOver");



const larguraCenario = cenario.offsetWidth;
const larguraPersonagem = personagem.offsetWidth;


let jogoIniciado = false;

let posicao = 0;
let direcao = 0;
let velocidade = 12;


let tempoAtual = 400;
let vidasAtual = parseInt(localStorage.getItem("vidasAtual"))|| 5;
vidas.textContent = vidasAtual;
let moedasAtual =  parseInt(localStorage.getItem("moedasAtual"))|| 0;
moedas.textContent = moedasAtual;
let pontosAtual =  parseInt(localStorage.getItem("pontosAtual"))|| 0;
pontos.textContent = pontosAtual;

let checarMovimentos;
let checarColisaoComInimigo;
let checarColisaoComBloco;
let checarRelogio;
let checarPulo;
let colidiu = false;






function teclaPressionada(event) {
    if (event.key === "ArrowRight") {
        direcao = 1;
    personagem.style.backgroundImage = "url(/img/marioAndandoLadoDireito.gif";

    } else if (
        event.key === "ArrowLeft") {
        direcao = -1;
        personagem.style.backgroundImage = "url(/img/marioAndandoLadoEsquerdo.gif";

    }else if(event.code === "Space"){
            personagem.classList.add("puloPersonagem");
            audiopulo.play();

    }if(colidiu)
        clearTimeout(checarPulo);
    else{
        colidiu = false;
            checarPulo = setTimeout(() => {
                personagem.classList.remove("puloPersonagem");

            },500)
    }}


    function teclaSolta(event) {
        if (event.key === "ArrowRight") {
            direcao = 0;
            personagem.style.backgroundImage = "url(/img/marioParadoLadoDireito.png)"    
        } else if (
            event.key === "ArrowLeft") {
            direcao = 0;
            personagem.style.backgroundImage = "url(/img/marioParadoLadoEsquerdo.png)"    

        }
}

function atualizarMovimentos() {
    posicao +=  direcao*velocidade;
    if(posicao < 0){
        posicao = 0;
        
   }else if (posicao + larguraPersonagem > larguraCenario){
   posicao = larguraCenario - larguraPersonagem;
   
   }
    personagem.style.left = posicao +"px";
    
}

function colisaoComBloco(){
    const checarPersonagem = personagem.getBoundingClientRect(); // checagem de retangulo do elemento
    const checarBloco = bloco.getBoundingClientRect();
    if (

        checarBloco.left < checarPersonagem.right &&
        checarBloco.right > checarPersonagem.right &&
        checarBloco.top< checarPersonagem.bottom &&
        checarBloco.bottom >   checarPersonagem.top
    ){

        clearInterval(checarColisaoComBloco);
        moedasAtual ++;
        moedas.textContent = moedasAtual;
        localStorage.setItem("moedasAtual", moedasAtual);
        pontosAtual += +10;
        pontos.textContent = pontosAtual;
        localStorage.setItem("pontosAtual", pontosAtual);
        audioMoeda.play();
        bloco.style.top = "320px";
        ChecarMoedas();
        setTimeout(() =>{
            checarColisaoComBloco = setInterval(colisaoComBloco,10);
            bloco.style.top = "390px";
        }, 300);
        }

     

}

function colisaoComInimgo(){
    const checarPersonagem = personagem.getBoundingClientRect(); // checagem de retangulo do elemento
    const checarInimigo = inimigo.getBoundingClientRect();
    if (

        checarInimigo.left < checarPersonagem.right &&
        checarInimigo.right > checarPersonagem.right &&
        checarInimigo.top< checarPersonagem.bottom &&
        checarInimigo.bottom >   checarPersonagem.top
    ){

        
        clearInterval(checarMovimentos);
        clearTimeout(checarPulo);
        removerTeclas();
        clearInterval (checarRelogio);
        clearInterval(checarColisaoComInimigo);
        vidasAtual --;
        vidas.textContent = vidasAtual;
        localStorage.setItem("vidasAtual", vidasAtual);
        personagem.style.backgroundImage = "url(/img/marioMorto.gif)";
        inimigo.style.display = "none";
        colidiu = true;
        audiojogoinicio.volume = 0;
        audioPerdeuVida.play();
        setTimeout(() =>{
                checarJogo();
        }, 3500);

    }

     

}



botaoReiniciar.addEventListener("click", function(){
    moedasAtual  = 0;
    moedas.textContent = moedasAtual;
    localStorage.setItem("moedasAtual", moedasAtual);
    pontosAtual = 0;
    pontos.textContent = pontosAtual;
    localStorage.setItem("pontosAtual", pontosAtual);
    vidasAtual = 5;
    vidas.textContent = vidasAtual;
    localStorage.setItem("vidasAtual", vidasAtual);
    location.reload();
  

})



// botaoIniciar.addEventListener("click", function () {
//     moedasAtual  = 0;
//     moedas.textContent = moedasAtual;
//     localStorage.setItem("moedasAtual", moedasAtual);
//     pontosAtual = 0;
//     pontos.textContent = pontosAtual;
//     localStorage.setItem("pontosAtual", pontosAtual);
//     vidasAtual = 5;
//     vidas.textContent = vidasAtual;
//     localStorage.setItem("vidasAtual", vidasAtual);
//     location.reload();

// })






function ChecarMoedas(){
    if (moedasAtual === 20){
        moedasAtual = 0;
        moedas.textContent = moedasAtual;
        vidasAtual++;
        vidas.textContent = vidasAtual;
        audioVidaExtra.play();
    }
}

function relogio(){
    tempoAtual --;
    tempo.textContent = tempoAtual;
    if(tempoAtual === 100){
        alert("corra o tempo esta acabando")
    }else if (tempoAtual === 0){
        removerTeclas();
        clearInterval (checarRelogio);
        personagem.style.backgroundImage = "url(/img/marioMorto.gif)";
        inimigo.style.display = "none";
    }
    
}

function checarJogo(){

    if (vidasAtual >=1){
        location.reload();
    }else {
        botaoReiniciar.style.display = "block";
        audioGameOver.play();
    }
}





const botao = document.createElement("button");



function removerTeclas(){
    document.removeEventListener("keydown", teclaPressionada);//função para remover os eventos de teclas
    document.removeEventListener("keyup", teclaSolta);
}




botaoIniciar.addEventListener("click", function(){

inimigo.classList.add("animarInimigo");
botaoIniciar.style.display = "none";
document.addEventListener("keydown",teclaPressionada);
document.addEventListener("keyup",teclaSolta);
checarMovimentos = setInterval(atualizarMovimentos,50);
checarColisaoComBloco = setInterval(colisaoComBloco, 10);
checarColisaoComInimigo = setInterval(colisaoComInimgo, 10);
checarRelogio = setInterval(relogio, 1000);
jogoIniciado = true;
audioesperando.volume = 0;
audiojogoinicio.play();

})

document.addEventListener("keydown", function (){
    if(!jogoIniciado && event.key === "Enter"){
        inimigo.classList.add("animarInimigo");
botaoIniciar.style.display = "none";
document.addEventListener("keydown",teclaPressionada);
document.addEventListener("keyup",teclaSolta);
checarMovimentos = setInterval(atualizarMovimentos,50);
checarColisaoComBloco = setInterval(colisaoComBloco, 10);
checarColisaoComInimigo = setInterval(colisaoComInimgo, 10);
checarRelogio = setInterval(relogio, 1000);
jogoIniciado = true;
audioesperando.volume = 0;
audiojogoinicio.play();

    }
    else if(jogoIniciado && event.key === "Enter"){
        alert("jogo ja foi iniciado");
    }

    
})