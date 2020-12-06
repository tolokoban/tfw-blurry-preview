attribute vec2 attXY;
attribute vec3 attColor;
varying vec3 varColor;

void main() {
    varColor = attColor;
    gl_Position = vec4(attX, 0.0, 1.0);
}