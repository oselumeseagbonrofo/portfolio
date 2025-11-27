/**
 * Custom GLSL shaders for the enhanced particle system
 * Requirements: 3.1, 3.2
 */

export const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  uniform float uIdleAnimation;
  
  attribute vec3 targetPosition;
  attribute float particleIndex;
  
  varying vec3 vPosition;
  varying float vDistanceToMouse;
  
  void main() {
    vec3 pos = position;
    
    // Wave animation for idle state
    float wave = sin(uTime * 0.5 + particleIndex * 0.1) * 0.1;
    float wave2 = cos(uTime * 0.3 + particleIndex * 0.15) * 0.08;
    pos.y += wave * uIdleAnimation;
    pos.x += wave2 * uIdleAnimation;
    
    // Mouse-based displacement
    vec2 mousePos = uMouse;
    vec2 particlePos2D = pos.xy;
    vec2 direction = particlePos2D - mousePos;
    float distance = length(direction);
    
    // Apply mouse influence with falloff
    float influence = uMouseInfluence / (1.0 + distance * distance * 0.5);
    vec2 displacement = normalize(direction) * influence * 0.3;
    pos.xy += displacement;
    
    // Store distance to mouse for fragment shader
    vDistanceToMouse = distance;
    vPosition = pos;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Point size with distance attenuation
    gl_PointSize = 4.0 * (300.0 / -mvPosition.z);
  }
`;

export const fragmentShader = `
  uniform vec3 uColorStart;
  uniform vec3 uColorEnd;
  uniform float uTime;
  
  varying vec3 vPosition;
  varying float vDistanceToMouse;
  
  void main() {
    // Circular point shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Gradient coloring based on particle position
    float gradientFactor = (vPosition.y + 2.0) / 4.0;
    gradientFactor = clamp(gradientFactor, 0.0, 1.0);
    vec3 color = mix(uColorStart, uColorEnd, gradientFactor);
    
    // Distance-based opacity (proximity highlighting)
    float proximityThreshold = 2.0;
    float proximityFactor = 1.0 - smoothstep(0.0, proximityThreshold, vDistanceToMouse);
    float baseOpacity = 0.6;
    float opacity = baseOpacity + proximityFactor * 0.4;
    
    // Glow effect for highlighted particles
    float glow = proximityFactor * 0.5;
    color += vec3(glow);
    
    // Soft edges for particles
    float edgeSoftness = 1.0 - smoothstep(0.3, 0.5, dist);
    opacity *= edgeSoftness;
    
    gl_FragColor = vec4(color, opacity);
  }
`;
