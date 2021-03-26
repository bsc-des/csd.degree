var container;
var camera, scene, renderer;
var uniforms;
var PIXEL_RATIO = window.devicePixelRatio || 1;

window.addEventListener("load", function () {
  init();
  animate();
});

const vertex = `
void main() {
    gl_Position = vec4( position, 1.0 );
}
`;

const fragment = `
#extension GL_OES_standard_derivatives: enable

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_pixel_ratio;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

vec3 contours(float x, float levels) {
  float f = fract(x * levels);
  float df = fwidth(x * levels);

  float y = smoothstep(df*2.0, df*4.0, f) + smoothstep(df*0.5, df*-0.0, f);

  y = y * 0.15 + 0.85;
  return vec3(y);
}

vec3 contour_fill(float x, float levels) {
  float c = floor(x*levels) / levels;
  vec3 color = vec3(.08 - c*0.08, pow(c, 3.0), .1 + c*.9);
  color = color * 0.9 + 0.1;
  return color;
}

void main() {
    vec2 mouse = vec2(u_mouse.x/u_resolution.x, 1.0 - u_mouse.y/u_resolution.y)*u_pixel_ratio;
    mouse.x *= u_resolution.x/u_resolution.y;
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(0.0);
    vec2 pos = vec2(st*(2.0/u_pixel_ratio));

    float DF = 0.0;

    // Add a random position
    float a = 0.0;
    vec2 vel = vec2(u_time*.05);
    DF += snoise(pos+vel)*.25+.25;

    // Add a random position
    a = snoise(pos*vec2(cos(u_time*0.05),sin(u_time*0.05))*0.1)*3.1415;
    vel = vec2(cos(a),sin(a));
    DF += snoise(pos+vel)*0.25+ 0.25;

    float x = fract(DF);

    // Mouse warp
    // x -= 0.2*(1.0 - clamp(0.0, 1.0, distance(st, mouse)));

    // Turn to contours
    color = contour_fill(x, 8.0);

    gl_FragColor = vec4(color, 1.0);
}
`;

function init() {
  container = document.getElementById("hero");

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  var geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_pixel_ratio: { type: "f", value: PIXEL_RATIO },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  document.onmousemove = function (e) {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
  };
}

function onWindowResize(event) {
  const w = container.offsetWidth;
  console.log(w);
  // const margin = parseInt(window.getComputedStyle(container).marginBottom);
  const margin = container.offsetTop;
  const h = container.offsetHeight + margin;
  renderer.setSize(w, h);
  uniforms.u_resolution.value.x = w;
  uniforms.u_resolution.value.y = h;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}
