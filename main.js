const SCREEN = { w: 720, h: 480 }

const settings = {
	vel : 10,
	road:{
		w: SCREEN.w,
		h: SCREEN.h,
		x: 0,
		y: 0,
	},
	motos:{
		w: SCREEN.w*0.1,
		h: SCREEN.h*0.2,
		x: SCREEN.w*0.23,
		y: SCREEN.h,
		velMin: 0.8,
		velMax: 0.1,
	}
}

const scenePlay = {
	init : function(){
		let c=0;
		const game = document.getElementById("game")
			styleGeral(game, SCREEN.w, SCREEN.h)

		/** Road */
		const road = document.createElement("div")
		road.id = "road"
		styleGeral(road, settings.road.w, settings.road.h, 0, settings.road.h*c--)
		for (var i = 0; i < 2; i++) {
			create(road, settings.road.w, settings.road.h, 0, settings.road.h*-1, "assets/background.png");
		}
		settings.road.y=settings.road.h*-1
		settings.road.yRoad=settings.road.y
		scenePlay.road=road
		game.appendChild(road)

		/** Motos */
		const motos = document.createElement("div")
		motos.id = "motos"
		styleGeral(motos, settings.road.w, settings.road.h, settings.road.x, settings.road.h*c--)
		settings.motos.yMotos=[]
		settings.motos.xMotos=[]
		settings.motos.yMaxMotos=[]
		for (var i = 0; i < 4; i++) {
			let y = (settings.motos.y*settings.motos.velMin)
			let x = settings.motos.x+(settings.motos.x*0.23*i)

			create(motos, settings.motos.w, settings.motos.h, x, y, "assets/moto_"+(i+1)+".png");
			settings.motos.yMotos.push(y)
			settings.motos.yMaxMotos.push(y)
			settings.motos.xMotos.push(x)

		}
		scenePlay.motos=motos
		game.appendChild(motos)

		/**Audio*/
		scenePlay.audio = document.createElement("audio")
		scenePlay.audio.src = "assets/moto.mp3"
		scenePlay.audio.loop = true
		scenePlay.audio.muted = true
		scenePlay.audio.volume = 0.3

		/** Play */
		scenePlay.counterDiv = document.createElement("div")
		scenePlay.counterP = document.createElement("p")
		scenePlay.counterDiv.id = "counter"
		scenePlay.counterP.id = "counter-p"
		scenePlay.counterDiv.style.zIndex = '20'
		styleGeral(scenePlay.counterDiv, SCREEN.w, SCREEN.h, 0, SCREEN.h*c--)
		scenePlay.counterDiv.appendChild(scenePlay.counterP)
        scenePlay.counterP.innerHTML = "Selecione uma cor"
		game.appendChild(scenePlay.counterDiv)

		this.restart()
	},
	restart: function(){
		buttons(true)
        scenePlay.counterP.innerHTML = "Selecione uma cor"

		settings.road.yRoad=settings.road.y
		for (var i = 0; i < 2; i++) {
			styleGeral(scenePlay.road.childNodes[i], '', '', 0, settings.road.yRoad);
		}

		settings.motos.yMotos=[]
		for (var i = 0; i < 4; i++) {
			let y = (settings.motos.y*settings.motos.velMin)
			styleGeral(scenePlay.motos.childNodes[i], '', '', settings.motos.xMotos[i], y);
			settings.motos.yMotos.push(y)
		}
	},
	play: function(fps = 20, timeMax = 30){
		scenePlay.time = timeMax
		scenePlay.count = 3000
		scenePlay.fps = 1000/fps

		/**Contador*/ 
		let time = 5.00;
        scenePlay.countI = setInterval(()=>{
            scenePlay.counterP.innerHTML = "Corrida comeca em "+time.toFixed(2).replace(".", ":")
            if(time <= 0){
            	scenePlay.counterDiv.className = "counter-off"
            	clearInterval(scenePlay.countI)

            	scenePlay.controlUpdate = setInterval(this.update, scenePlay.fps)
				setTimeout(()=>scenePlay.win(), timeMax*1000)
            }
            time -= 0.01
        }, 10)	
    },
	update : function(){
		scenePlay.audio.muted = false
		/** Road */
		scenePlay.time -= scenePlay.fps/1000
		scenePlay.count += scenePlay.fps

        scenePlay.counterP.innerHTML = scenePlay.time.toFixed(2).replace(".", ":")


		settings.road.yRoad += settings.vel
		if(settings.road.yRoad>=0){
			settings.road.yRoad = settings.road.y
		}
		for (var i = 0; i < scenePlay.road.childNodes.length; i++) {
			styleGeral(scenePlay.road.childNodes[i], '', '', 0, settings.road.yRoad);
		}

		/** Motos */
		for (var i = 0; i < scenePlay.motos.childNodes.length; i++) {
			/*yMotos*/
			if(scenePlay.count >= 3000){
				let max = 1
				let min = 0

				settings.motos.yMaxMotos[i] = (Math.random() * (max - min) + min).toFixed(2)

				max = 1
				min = -2
				let value = Math.random() * (max - min) + min
				settings.motos.yMaxMotos[i] *= value < 0 ? 1 : 0

			}
			settings.motos.yMotos[i] -= settings.motos.yMaxMotos[i]

			if ( settings.motos.yMotos[i] > SCREEN.h*settings.motos.velMin){
				settings.motos.yMotos[i] = SCREEN.h*settings.motos.velMin
			}
			if ( settings.motos.yMotos[i] < SCREEN.h*settings.motos.velMax){
				settings.motos.yMotos[i] = SCREEN.h*settings.motos.velMax
			}
			styleGeral(scenePlay.motos.childNodes[i], '', '', settings.motos.xMotos[i], settings.motos.yMotos[i]);

		}
		if(scenePlay.count >= 3000){
			scenePlay.count = 0
		}
	},	
	win : function(){
		scenePlay.audio.muted = true
		clearInterval(scenePlay.controlUpdate)
		let mValue;
		for (var i = 0; i < 4; i++) {
			if (i == 0){
				mValue =i
			}else if(settings.motos.yMotos[mValue] > settings.motos.yMotos[i]){
				mValue = i
			}
		}
        let color = ["Preta", "Vermelha", "Branca", "Azul"]

        scenePlay.counterDiv.className = ""
        if (mValue == scenePlay.colorUser){ scenePlay.counterP.innerHTML = "Voce venceu!!!" }
        else{scenePlay.counterP.innerHTML = "Moto de cor " + color[mValue] + " venceu!!!"}
        

        /*Loop*/
        setTimeout(()=>{
			this.restart()
        	//play()
        }, 3000) 
    }	
}

function create(tag, w, h, x, y, src){
	let img = document.createElement("img")
	img.src = src
	styleGeral(img, w, h, x, y)
	tag.appendChild(img)
}

function styleGeral(tag, w, h, x='none', y='none') {
	y == 'none' ? 'continue' : tag.style.top = y + 'px' 
	x == 'none' ? 'continue' : tag.style.left = x + 'px'
	w == 'none' ? 'continue' : tag.style.width = w + 'px'
	h == 'none' ? 'continue' : tag.style.height = h + 'px'
}
function play(color){
	scenePlay.colorUser = color
	buttons(false)
	scenePlay.play()
	scenePlay.audio.play()
}
function buttons(on=true){
	const buttons = document.querySelector(".buttons")

	if(on){
		for (var i = 0; i < buttons.childNodes.length; i++) {
			buttons.childNodes[i].onclick = () => { play(i) }
		}
	}else{
		for (var i = 0; i < buttons.childNodes.length; i++) {
			buttons.childNodes[i].onclick = ''
		}
	}
}

scenePlay.init()

