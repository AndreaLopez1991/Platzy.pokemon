
const sectionReiniciar = document.getElementById('Reiniciar')
const botonMascotaJugador = document.getElementById('boton-mascota')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')

sectionReiniciar.style.display = 'none'
const botonReiniciar = document.getElementById ('boton-reiniciar')

const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')

const spanMascotaJugador = document.getElementById ('mascota-jugador')
const spanMascotaEnemigo = document.getElementById('mascota-enemigo')

const spanviditaJugador= document.getElementById('vidas-jugador')
const spanviditaEnemigo=document.getElementById('vidas-enemigo')

const sectionMensajes = document.getElementById ('resultado')
const ataqueDelJugador= document.getElementById ('ataques-del-jugador')
const ataqueDelEnemigo = document.getElementById ('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById ('contenedorAtaques')

const sectionVerMapa = document.getElementById ('ver-mapa')
const mapa = document.getElementById ('mapa')

let jugadorId= null
let pokemon = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDePokemones
let inputCharmander
let inputBalbasaur
let inputSquirtle
let mascotaJugador
let mascotaJugadorObjeto
let ataquesPokemon
let ataquesPokemonEnemigo
let botonFuego 
let botonAgua 
let botonTierra
let botones = [] 
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let viditaJugador = 3
let viditaEnemigo = 3
let lienzo = mapa.getContext('2d')
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './Imagenes/gimnasioP.jpg'


class Pokemon {
    constructor(nombre , foto , vida, fotoMapa, x = 10 , y = 10, id=null){
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques=[]
        this.ancho = 40
        this.alto = 40
        this.x = x
        this.y = y
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarPokemon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}  
let Charmander = new Pokemon('Charmander','Imagenes/charmander-removebg-preview.png',5, './Imagenes/pokeCharma.png')

let Balbasaur = new Pokemon ('Balbasaur','Imagenes/balbasaur-removebg-p.png',5, './Imagenes/pokeBalba.png')

let Squirtle = new Pokemon ('Squirtle','Imagenes/squirtle-removebg-preview.png',5,'./Imagenes/pokeSquir.png')

const SQUIRTLE_ATAQUES= [
    {nombre:'💧',id:'boton-Agua'},
    {nombre:'💧',id:'boton-Agua'} ,
    {nombre:'💧',id:'boton-Agua'},
    {nombre:'🔥',id:'boton-fuego'},
    {nombre:'🌱',id:'boton-tierra'}, 
]

Squirtle.ataques.push(...SQUIRTLE_ATAQUES)

const BALBASAUR_ATAQUES=[

    {nombre:'🌱',id:'boton-tierra'},
    {nombre:'🌱',id:'boton-tierra'},   
    {nombre:'🌱',id:'boton-tierra'},
    {nombre:'💧',id:'boton-Agua'},
    {nombre:'🔥',id:'boton-fuego'}, 
]
Balbasaur.ataques.push(...BALBASAUR_ATAQUES)


const CHARMANDER_ATAQUES=[

    {nombre:'🔥',id:'boton-fuego'},    
    {nombre:'🔥',id:'boton-fuego'},
    {nombre:'🔥',id:'boton-fuego'},
    {nombre:'💧',id:'boton-Agua'},
    {nombre:'🌱',id:'boton-tierra'},
]

Charmander.ataques.push(...CHARMANDER_ATAQUES)    
   

pokemon.push(Charmander,Balbasaur,Squirtle)

function iniciarJuego() {
    sectionVerMapa.style.display = 'none'
    sectionSeleccionarAtaque.style.display= 'none' 

    pokemon.forEach((Pokemon) => {
        opcionDePokemones = `
        <input type="radio" name="Mascota" id=${Pokemon.nombre} />
            <label class="tarjeta-de-pokemon"for=${Pokemon.nombre}>
            <p>${Pokemon.nombre}</p>
            <img src=${Pokemon.foto} alt=${Pokemon.nombre}>
        </label>
        `
    contenedorTarjetas.innerHTML += opcionDePokemones
     
     inputCharmander = document.getElementById ('Charmander')
     inputBalbasaur = document.getElementById ('Balbasaur')
     inputSquirtle = document.getElementById ('Squirtle')
    
    })

      botonMascotaJugador.addEventListener('click',seleccionarMascotaJugador)

      botonReiniciar.addEventListener('click',reiniciarJuego)

      unirseAlJuego()
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
    .then(function (res) {
        if (res.ok) {
            res.text()
            .then (function (respuesta) {
                console.log(respuesta)
                jugadorId = respuesta
            })
        }
    })
}

function seleccionarMascotaJugador(){
    
    sectionSeleccionarMascota.style.display = 'none' 
      
    if (inputCharmander.checked){
        spanMascotaJugador.innerHTML = inputCharmander.id
        mascotaJugador = inputCharmander.id
    } else if (inputBalbasaur.checked){
        spanMascotaJugador.innerHTML = inputBalbasaur.id
        mascotaJugador = inputBalbasaur.id
    } else if (inputSquirtle.checked){
        spanMascotaJugador.innerHTML = inputSquirtle.id
        mascotaJugador = inputSquirtle.id
    }else {
        alert('Selecciona una mascota')
    }

    seleccionarPokemon(mascotaJugador)

    extraerAtaques(mascotaJugador)
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()
   
}
function seleccionarPokemon(mascotaJugador){
    fetch(`http://localhost:8080/pokemon/${jugadorId}`, {
    method: "post" ,
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        pokemon: mascotaJugador
    })
})   
}

function extraerAtaques (mascotaJugador){
    let ataques
    for (let i = 0 ; i <pokemon.length; i++){
        if (mascotaJugador === pokemon[i].nombre){
            ataques =pokemon [i].ataques
        }
    }
    mostrarAtaques(ataques)
}
function mostrarAtaques(ataques){
    ataques.forEach((ataque) =>{
        ataquesPokemon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre} </button>
        `

        contenedorAtaques.innerHTML += ataquesPokemon
    
})
 botonFuego = document.getElementById ('boton-fuego')
 botonAgua  = document.getElementById ('boton-Agua')
 botonTierra = document.getElementById ('boton-tierra')
 botones = document.querySelectorAll ('.BAtaque')

 
}
function secuenciaAtaque(){
    botones.forEach((boton) => {
        boton.addEventListener ('click', (e) => {
            if (e.target.textContent === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            } else if (e.target.textContent === '🔥'){
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }
            ataqueAleatorioEnemigo()
        })
    })
    
}

function seleccionarMascotaEnemigo(enemigo){
   
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesPokemonEnemigo = enemigo.ataques
    secuenciaAtaque ()

}
function ataqueAleatorioEnemigo(){
    let ataqueAleatorio = aleatorio (0,ataquesPokemonEnemigo.length -1)
    
    if (ataqueAleatorio == 0 || ataqueAleatorio ==1){
        ataqueEnemigo.push('FUEGO')
    }else if (ataqueAleatorio == 3 || ataqueAleatorio ==4){
        ataqueEnemigo.push('AGUA')
    }else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
 
}
function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
}
function indexAmbosOponente(jugador, enemigo){
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo [enemigo]
}
function combate(){
    for (let index = 0; index < ataqueJugador.length; index++) {
       if (ataqueJugador[index] === ataqueEnemigo[index]) {
        indexAmbosOponente(index , index)
        crearMensaje("EMPATE")
        
    }else if (ataqueJugador[index] === 'FUEGO' && ataqueEnemigo [index ]=== 'TIERRA'){
        indexAmbosOponente(index , index)
        crearMensaje("GANASTE")
        victoriasJugador++
        spanviditaJugador.innerHTML = victoriasJugador
        
    }else if (ataqueJugador[index] ==='AGUA' && ataqueEnemigo [index]=== 'FUEGO') {
        indexAmbosOponente(index , index)
        crearMensaje("GANASTE")  
        victoriasJugador++
        spanviditaJugador.innerHTML = victoriasJugador
    }else if (ataqueJugador [index] === 'TIERRA' && ataqueEnemigo [index] === 'AGUA'){
        indexAmbosOponente (index , index)
        crearMensaje ("GANASTE")
        victoriasJugador++
        spanviditaJugador.innerHTML = victoriasJugador
    
    }else{
        indexAmbosOponente (index , index)
        crearMensaje ("PERDISTE")
        victoriasEnemigo++
        spanviditaEnemigo.innerHTML = victoriasEnemigo
    }
}

    revisarVidas()
}
function revisarVidas(){
    if (victoriasJugador ===victoriasEnemigo){
        crearMensajeFinal("esto fue un Empate")
    }else if(victoriasJugador > victoriasEnemigo){
        crearMensajeFinal ("FELICITACIONES! Ganaste :)")
    }else {
        crearMensajeFinal('Lo siento, perdiste :(')
    }
}

function crearMensaje(resultado){
    
    let nuevoataqueDelJugador=document.createElement('p')
    let nuevoataqueDelEnemigo=document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoataqueDelJugador.innerHTML= indexAtaqueJugador
    nuevoataqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataqueDelJugador.appendChild(nuevoataqueDelJugador)
    ataqueDelEnemigo.appendChild(nuevoataqueDelEnemigo)

}
function crearMensajeFinal(resultadoFinal){
    

    sectionMensajes.innerHTML = resultadoFinal
      
    sectionReiniciar.style.display = 'block'

}
function reiniciarJuego(){
    location.reload()
}

function aleatorio(min,max){
    return Math.floor(Math.random()* (max - min + 1)+ min)
}

function pintarCanvas(){
   mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
   mascotaJugadorObjeto.y =mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
   
    enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)
    mascotaJugadorObjeto.pintarPokemon()

   CharmanderEnemigo.pintarPokemon()
   BalbasaurEnemigo.pintarPokemon()
   SquirtleEnemigo.pintarPokemon()



   if(mascotaJugadorObjeto.velocidadX !==0 || mascotaJugadorObjeto.velocidadY !==0){
    revisarColision(CharmanderEnemigo)
    revisarColision(BalbasaurEnemigo)
    revisarColision(SquirtleEnemigo)
   }
}
function enviarPosicion(x, y){
    fetch(`http://localhost:8080/pokemon/${jugadorId}/posicion`,{
        method:"post",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            x,
            y
        })
    })
    .then(function (res){
        if (res.ok){
            res.json()
            .then(function ({enemigos}){
                enemigos.forEach(function(enemigo){
                    let pokemonEnemigo = null
                    const pokemonNombre = enemigo.pokemon.nombre || ""
                    if (pokemonNombre === "Charmander"){
                        pokemonEnemigo = new Pokemon('Charmander','Imagenes/charmander-removebg-preview.png',5, './Imagenes/pokeCharma.png',80 , 120)
                    }else if (pokemonNombre === "Balbasaur"){
                        pokemonEnemigo = new Pokemon ('Balbasaur','Imagenes/balbasaur-removebg-p.png',5, './Imagenes/pokeBalba.png',150, 65)
                    }else if (pokemonNombre === "Squirtle"){
                        pokemonEnemigo = new Pokemon ('Squirtle','Imagenes/squirtle-removebg-preview.png',5,'./Imagenes/pokeSquir.png',200,500)
                    }
                    
                    pokemonEnemigo.x = enemigo.x
                    pokemonEnemigo.y = enemigo.y
                    pokemonEnemigo.pintarPokemon()
                    
                })
     
            })
        }
    })
 }

function moverDerecha() {
   mascotaJugadorObjeto.velocidadX = 5
}
function moverIzquierda() {
    mascotaJugadorObjeto.velocidadX = -5

}
 function moverAbajo() {
   mascotaJugadorObjeto.velocidadY = 5
   
}
 function moverArriba() {
    mascotaJugadorObjeto.velocidadY = -5
  
}
function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}
function sePresionoUnaTecla(event){
   switch (event.key) {
    case 'ArrowUp':
        moverArriba()
        break
    case 'ArrowDown':
        moverAbajo()
        break
    case 'ArrowLeft':
        moverIzquierda()
        break
    case 'ArrowRight':
        moverDerecha()   
        break 
    default:
        break;

    }
}
function iniciarMapa(){
    mapa.width = 380
    mapa.height = 260

    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown',sePresionoUnaTecla)

    window.addEventListener('keyup',detenerMovimiento)
 
}
function obtenerObjetoMascota(){
    for (let i = 0 ; i <pokemon.length; i++){
        if (mascotaJugador === pokemon[i].nombre){
            return pokemon[i]
        }
    }
}
function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = mascotaJugadorObjeto.y
    const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = mascotaJugadorObjeto.x

    if(
        abajoMascota < arribaEnemigo || 
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    console.log('Se detecto una colision')
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
 
}


window.addEventListener('load', iniciarJuego)
