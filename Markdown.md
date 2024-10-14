# Audio Visualizer Tutorial
├── Articles
├── YouTube
├── Contact
├── About
├── How to Create a 3D Audio Visualizer Using Three.js
│   ├── Published on 11 Sep, 2024 | ~13 min read | Demo
│   ├── Introduction
│   │   └── Note: Basic understanding of Three.js, GLSL, and shaders required.
│   ├── Table of Contents
│   │   ├── The Preparations
│   │   ├── Creating the Sphere
│   │   ├── Uniforms and Shaders
│   │   ├── Turning the Sphere into an Animated Blob
│   │   ├── Using Audio Frequencies to Animate the Blob
│   │   ├── It's Time for Some Post-Processing
│   │   ├── Controlling the Colors and Glow Properties
│   │   ├── Finishing Up with a Cool Camera Effect
│   │   └── Conclusion
│   └── Credits and Resources
│   
├── The Preparations
│   ├── Project Setup
│   │   └── Download Three.js boilerplate
│   ├── Remove Helpers
│   │   └── Comment or delete: renderer.setClearColor(0xfefefe);
│   └── Create Sphere
│       ├── Use IcosahedronGeometry
│       └── ShaderMaterial with wireframe mode
│   
├── Creating the Sphere
│   ├── Code Example
│   └── Explanation
│
├── Uniforms and Shaders
│   ├── Adding Vertex and Fragment Shaders
│   ├── Linking Shaders to Material
│   └── Setting Up Uniforms
│
├── Turning the Sphere into an Animated Blob
│   ├── Introduce Time and Perlin Noise
│   ├── Copy Perlin Noise Functions
│   ├── Implement Displacement Calculation
│   └── Animate with Time
│
├── Using Audio Frequencies to Animate the Blob
│   ├── Load Audio File
│   ├── Play Audio on Click
│   ├── Synchronize Animations with Audio
│   └── Update Vertex Displacement Using Frequencies
│
├── It's Time for Some Post-Processing
│   ├── Import Post-Processing Modules
│   ├── Set Output Color Space
│   ├── Create Render Passes
│   ├── Create Composer
│   ├── Add Passes to Composer
│   └── Use requestAnimationFrame
│
├── Controlling the Colors and Glow Properties
│   └── Adjust Post-Processing Parameters
│
├── Finishing Up with a Cool Camera Effect
│   └── Implement Camera Effects
│
└── Conclusion
