const canvas = document.querySelector("canvas")
canvas.width = innerWidth
canvas.height = innerHeight
const c = canvas.getContext("2d")
var score = document.querySelector("#score")
var parentModal = document.querySelector(".parentModal")
var startButton = document.querySelector(".button")
var lastScore = document.querySelector(".modal h1")
console.log(lastScore)

class Player{
	constructor(x,y,radius,color,) {
		this.x=x;
		this.y=y;
		this.color=color;
		this.radius=radius;
	}

	draw(){
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true)
       c.fillStyle = this.color
       c.fill()
	}
}

class Projection{
	constructor(x,y,radius,color,volacity){
		this.x = x;
		this.y = y;
		this.color = color;
		this.radius = radius;
		this.volacity = volacity;

	}
    draw(){
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true)
       c.fillStyle = this.color
       c.fill()
	}
	update(){
       this.draw()
		this.x = this.x + this.volacity.x;
		this.y = this.y + this.volacity.y;
	}
}

class Enemy{
	constructor(x,y,radius,color,volacity){
		this.x = x;
		this.y = y;
		this.color = color;
		this.radius = radius;
		this.volacity = volacity;

	}
    draw(){
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true)
       c.fillStyle = this.color
       c.fill()
	}
	update(){
       this.draw()
		this.x = this.x + this.volacity.x;
		this.y = this.y + this.volacity.y;
	}
}
const friction = 0.99;

class Particule{
	constructor(x,y,radius,color,volacity){
		this.x = x;
		this.y = y;
		this.color = color;
		this.radius = radius;
		this.volacity = volacity;
		this.alpha = 1;

	}
    draw(){
    	c.save()
    	c.globalAlpha =this.alpha
       c.beginPath()
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true)
       c.fillStyle = this.color
       c.fill()
       c.restore()
	}
	update(){
       this.draw()
       this.volacity.x *=friction;
       this.volacity.y *=friction;
		this.x = this.x + this.volacity.x;
		this.y = this.y + this.volacity.y;
     	this.alpha -=0.01 ;
	}
}

const x =canvas.width / 2;
const y =canvas.height / 2;

let player = new Player(x,y,10,"white")
let projectiles = [];
let enemies = [];
let particules = [];
let animationId;
let note = 0;
 function init(){
	player = new Player(x,y,10,"white")
	projectiles = [];
	enemies = [];
	particules = [];	
	animationId;
    note = 0;
 }

function spanEnemies(){
	setInterval(() => {
			  const radius = Math.random()*(30 - 5) + 5;
			  let x;
			  let y;
			  if (Math.random() < 0.5) {
			     x = Math.random() < 0.5 ? 0-radius : canvas.width + radius;
	             y = Math.random() * canvas.height
			  }else{
				 x = Math.random() * canvas.height;
				 y = Math.random() < 0.5 ? 0-radius : canvas.width + radius;	
			  }

	  const color = `hsl(${Math.random() * 360} ,50%,50%`;
		const angle = Math.atan2(canvas.height / 2 - y,canvas.width / 2 -x);
		const volacity = {
		x: Math.cos(angle),
		y: Math.sin(angle),
		}

	  enemies.push(new Enemy(x,y,radius,color,volacity))

	}, 1000)
}
function animate(){
	animationId = requestAnimationFrame(animate)
	c.fillStyle="rgba(0,0,0,0.1)"
	c.fillRect(0,0,canvas.width,canvas.height)
	player.draw()
	particules.forEach((particule,index)=>{
		if(particule.alpha <= 0){
			particules.splice(index,1)
		}else{
	   particule.update()	
		}

	})
	projectiles.forEach((projectile,index) => {
	  projectile.update()
	  if(Math.floor(projectile.x + projectile.radius) < 0||
	     Math.floor(projectile.x - projectile.radius) > canvas.width||
	     Math.floor(projectile.y + projectile.radius) < 0||
	     Math.floor(projectile.y - projectile.radius) > canvas.height
	  ){
	  	setTimeout(()=>{
	  	projectiles.splice(index,1)

	  },0)
	  }
	})

		enemies.forEach((enemy,index)=>{
			enemy.update()
			const killerDist = Math.hypot(player.x - enemy.x,player.y - enemy.y)
				if(Math.floor(killerDist - enemy.radius - player.radius) < 1){
					lastScore.innerText = note
					parentModal.classList.remove("active")
					cancelAnimationFrame(animationId)
				setTimeout(()=>{enemies.splice(index,1)},0)
				}
			projectiles.forEach((projectile,projectindex) => {
			const dist = Math.hypot(projectile.x - enemy.x,projectile.y - enemy.y)
			//whene projectile touch enemy
			if(Math.floor(dist - enemy.radius - projectile.radius) < 1){
				//craete explosition
				for (let i = 0 ; i < enemy.radius * 2; i++) {
					particules.push(new Particule(projectile.x,projectile.y,Math.random() * 3,enemy.color,
						{
							x:(Math.random() - 0.5) * (Math.random() *4),
							y:(Math.random() - 0.5) * (Math.random() *8)
						}
						))
				}
				if(enemy.radius -10 > 10){
					enemy.radius -= 10
					note += 100;
					score.innerText = note
				
			       projectiles.splice(projectindex,1)
				}else{
			  setTimeout(() => {
			  	note += 250
				score.innerText =note
			  enemies.splice(index,1)
			  projectiles.splice(projectindex,1)
				}, 0)	
				}


			}
	})



	})
}



window.addEventListener("mousemove",(event) => {

	const angle = Math.atan2(event.clientY - canvas.height / 2,event.clientX - canvas.width / 2);
	const volacity = {
     x: Math.cos(angle) * 8,
     y: Math.sin(angle) * 8,
	}
	projectiles.push(new Projection(canvas.width/2,canvas.height/2,5,"white",volacity))
});



startButton.addEventListener("click",()=>{
	parentModal.classList.add("active")
	init()
	score.innerText =note
    animate()
    spanEnemies()	
})

