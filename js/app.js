document.addEventListener('DOMContentLoaded', () => {
  const audioUrl = '/audio/audio.mp3';
  const imageUrl = '/img/circle.png';

  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  const updateProgressBar = () => {
    const progressBar = document.getElementById('progressBar');
    const dotContainer = document.getElementById('dotContainer');
    const progressPercentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    dotContainer.style.left = `${progressPercentage}%`;
  };
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const audio = new Audio(audioUrl);
  audio.crossOrigin = 'anonymous';

  const image = new Image();
  image.src = imageUrl;
  image.crossOrigin = 'anonymous';

  image.addEventListener('load', () => {
    const audioContext = new(window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let prevAvgVolume = 0;
    const zoomFactor = 1.1;

    const drawVisualizer = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.5;
      const radius = maxRadius * 0.8;

      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const avgVolume = sum / bufferLength;

      // Update background image scale
      const mainBody = document.getElementById('mainBody');
  
  const scaleFactor = 1 + (avgVolume / 255) * (zoomFactor);
  const widthScale = `calc(100% * ${scaleFactor})`;
  const heightScale = `calc(100% * ${scaleFactor})`;
  mainBody.style.backgroundSize = `${widthScale} ${heightScale}`;
  prevAvgVolume = avgVolume;

      analyser.getByteFrequencyData(dataArray);

      for (let i = 0; i < bufferLength; i++) {
        const angle = i * (Math.PI * 2) / bufferLength;
        const value = dataArray[i] / 255;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;

        const x2 = centerX + Math.cos(angle) * (radius + maxRadius * 0.8 * value);
        const y2 = centerY + Math.sin(angle) * (radius + maxRadius * 0.8 * value);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsl(${i * (360 / bufferLength)}, 100%, 50%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x2, y2, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 2)';
        ctx.fill();
      }

      const imageSize = radius * 1.9;
      ctx.drawImage(image, centerX - imageSize / 2, centerY - imageSize / 2, imageSize, imageSize);

      requestAnimationFrame(drawVisualizer);
    };
    document.getElementById('startButton').addEventListener('click', () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const startButton = document.getElementById('startButton');
      startButton.style.animation = 'fadeOut 1s forwards';
      setTimeout(() => {
        startButton.style.display = 'none';
      }, 1000);

      document.getElementById('songInfo').style.display = 'block';
      const enjoyMusic = document.getElementById('enjoyMusic');
      enjoyMusic.classList.remove('hidden');
      enjoyMusic.animate([{
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(1)'
        },
        {
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)',
          offset: 0.2
        },
        {
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(3)'
        }
      ], {
        duration: 3000,
        easing: 'ease-out'
      }).onfinish = () => {
        enjoyMusic.classList.add('hidden');
      };
      audio.play();
      audio.addEventListener('timeupdate', updateProgressBar);
      drawVisualizer();
    });

  });
});
