precision highp float;

uniform float progress;
uniform float count;
uniform float smoothness;
uniform vec2 resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Criando um efeito de listras
    float stripes = fract(count * uv.x);

    // Progress controlado com smoothstep
    float effect = smoothstep(-smoothness, 0.0, uv.y - progress * (1.0 + smoothness));

    // Aplicando a máscara de listras
    float mask = step(effect, stripes);
    
    // Definindo a cor de saída
    gl_FragColor = vec4(vec3(mask), 1.0);
}
