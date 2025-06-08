import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/Phys-Sim-Capstone/', // Change to your repo name
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'ClothSim.html'),
        
      },
    },
  },
});
