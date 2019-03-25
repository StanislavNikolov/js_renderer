const canvas = document.getElementById('mainCanvas');

const refitCanvas = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
refitCanvas();
window.addEventListener('resize', refitCanvas);

const context = canvas.getContext('2d');

class plane {
	constructor(a, b, c, d) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
	}
}

class vec3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	len() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}
	normalizei() {
		const l = this.len();
		this.x /= l;
		this.y /= l;
		this.z /= l;
		///
	}
	scalei(s) {
		this.x *= s;
		this.y *= s;
		this.z *= s;
		///
	}
	sub(other) {
		return new vec3(this.x - other.x, this.y - other.y, this.z - other.z);
	}
	coli(pln) {
		const c = pln.d / (pln.a * this.x + pln.b * this.y + pln.c * this.z);
		this.scalei(c);
	}
}
const mathToScr = (p) => {
	return {x: p.x + canvas.width / 2, y: canvas.height / 2 - p.y }
};

const camera = new vec3(50, 50, -10);
const camplane = new plane(0, 0, 1, 1000);

//let pd = 100.0;

const renderPoints = (points) => {
	context.beginPath();
	let cnt = 0;
	for(const p of points) {
		const ray = p.sub(camera)
		ray.coli(camplane);
		//ray.scalei(pd / ray.z);

		const coord = mathToScr(ray);
		context.lineTo(coord.x, coord.y);

		//context.fillText(cnt++, coord.x, coord.y);
	}
	context.closePath();
	context.stroke();
}


class cube {
	constructor(c, s) {
		const hs = s * 0.5;

		this.p = [
		          new vec3(c.x - hs, c.y - hs, c.z - hs),
		          new vec3(c.x + hs, c.y - hs, c.z - hs),
		          new vec3(c.x + hs, c.y - hs, c.z + hs),
		          new vec3(c.x - hs, c.y - hs, c.z + hs),
		          new vec3(c.x - hs, c.y + hs, c.z - hs),
		          new vec3(c.x + hs, c.y + hs, c.z - hs),
		          new vec3(c.x + hs, c.y + hs, c.z + hs),
		          new vec3(c.x - hs, c.y + hs, c.z + hs),
		];
		this.faces = [
			          [this.p[0], this.p[1], this.p[2], this.p[3]],
			          [this.p[0], this.p[1], this.p[5], this.p[4]],
			          [this.p[1], this.p[2], this.p[6], this.p[5]],
			          [this.p[3], this.p[2], this.p[6], this.p[7]],
			          [this.p[0], this.p[3], this.p[7], this.p[4]],
			        //[this.p[4], this.p[5], this.p[6], this.p[7]],
		];
	}
	render() {
		for(const f of this.faces) renderPoints(f);
	}
}

const cubes = [];
const s = 50;
for(let i = 0;i < 40;i ++) {
	for(let j = 0;j < 40;j ++) {
		const d = Math.sqrt(i * i + j * j) / 2;
		const c = Math.sin(d);
		cubes.push(new cube(new vec3(i * s, c * 20, j * s), s));
	}
}
//cubes.push(new cube(new vec3(100, 50, 20), 50));
//cubes.push(new cube(new vec3(150, 50, 70), 50));

const draw = () => {
	context.clearRect(0, 0, canvas.width, canvas.height);

	for(const c of cubes) c.render();

	window.requestAnimationFrame(draw);
}

draw();

window.addEventListener('keydown', (event) => {
	//console.log(event.code);

	if(event.code == 'KeyA') camera.x -= 10;
	if(event.code == 'KeyD') camera.x += 10;
	if(event.code == 'KeyW') camera.z += 10;
	if(event.code == 'KeyS') camera.z -= 10;
	if(event.code == 'KeyQ') camera.y += 10;
	if(event.code == 'KeyE') camera.y -= 10;

	if(event.code == 'ArrowUp')   camplane.d += 1;
	if(event.code == 'ArrowDown') camplane.d -= 1;

	console.log(camera, camplane);
});
