    particlesJS('particles-js', {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 4,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: false
        },
        move: {
          speed: 1
        }
      },
      interactivity: {
        events: {
          onhover: {
            enable: true,
            mode: 'repulse'
          }
        }
      },
      retina_detect: true
    });
