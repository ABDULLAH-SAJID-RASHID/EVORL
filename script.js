/* =========================================================
   EVORL MINERAL HYDRATION — Executive Light & Glacial Theme
   Production Application Logic & Water Ripple Engine (script.js)
   ========================================================= */

function evorlApp() {
  return {
    scrolled: false,
    mobileMenuOpen: false,
    modalOpen: false,
    lightboxOpen: false,
    lightboxItem: null,
    activeCategory: 'all',

    orderSent: false,
    orderError: '',
    whatsappUrl: '',
    orderForm: {
      name: '',
      phone: '',
      address: '',
      frequency: 'One-Time',
      notes: '',
    },
    orderItems: [
      {
        name: '500ml Mineral Water (Pack of 12)',
        unit: '12 x 500ml Sealed Bottles • Boardroom & Event Case',
        qty: 0,
      },
      {
        name: '1.5-Litre Mineral Water (Pack of 6)',
        unit: '6 x 1.5L Family Dining Bottles • pH 7.4 Balanced',
        qty: 0,
      },
      {
        name: '19-Litre Bulk Mineral Water Refill',
        unit: '19L BPA-Free Polycarbonate Jar • Doorstep Exchange',
        qty: 0,
      },
      {
        name: '20-Litre Heavy-Duty Metal Stand',
        unit: 'Anti-Rust Powder-Coated Cradle + Non-Drip Valve',
        qty: 0,
      },
      {
        name: '20-Litre Manual Vacuum Water Pump',
        unit: 'Airtight Food-Grade Press Pump • Zero Electricity',
        qty: 0,
      },
      {
        name: '20-Litre Smart Electric Water Pump',
        unit: 'USB-C Rechargeable • Stainless Steel 304 Spout',
        qty: 0,
      },
    ],

    showcaseProducts: [
      {
        category: 'bulk',
        categoryLabel: 'Bulk Bottles • 19 Litres',
        badge: 'Flagship Refill',
        title: '19-Litre Executive Mineral Jar',
        orderName: '19-Litre Bulk Mineral Water Refill',
        subtitle:
          'Thermally sanitized, tamper-sealed 19L polycarbonate bottle filled with 7-stage pH 7.4 remineralized water.',
        img: 'images/product-19l.jpg',
      },
      {
        category: 'retail',
        categoryLabel: 'Retail Packs • 500ml x 12',
        badge: 'Boardroom & Events',
        title: '500ml Mineral Water (Pack of 12)',
        orderName: '500ml Mineral Water (Pack of 12)',
        subtitle:
          'Shrink-wrapped 12-bottle case engineered for corporate meetings, clinics, hospitality suites, and guest service.',
        img: 'images/product-500ml.jpg',
      },
      {
        category: 'retail',
        categoryLabel: 'Retail Packs • 1.5L x 6',
        badge: 'Family Table Pack',
        title: '1.5-Litre Mineral Water (Pack of 6)',
        orderName: '1.5-Litre Mineral Water (Pack of 6)',
        subtitle:
          'Six crystal-clear 1.5-litre bottles balanced to 145 PPM TDS for daily household hydration and dining.',
        img: 'images/product-1-5l.jpg',
      },
      {
        category: 'hardware',
        categoryLabel: 'Dispensers & Stands • Steel',
        badge: 'Zero-Power Cradle',
        title: '20-Litre Heavy-Duty Metal Stand',
        orderName: '20-Litre Heavy-Duty Metal Stand',
        subtitle:
          'Reinforced powder-coated steel stand paired with a food-grade fast-flow valve for effortless countertop pouring.',
        img: 'images/product-stand.jpg',
      },
      {
        category: 'hardware',
        categoryLabel: 'Dispensers & Stands • Manual',
        badge: 'Portable Vacuum',
        title: '20-Litre Manual Vacuum Water Pump',
        orderName: '20-Litre Manual Vacuum Water Pump',
        subtitle:
          'High-compression food-grade BPA-free manual dispenser pump with protective sanitary spout cap.',
        img: 'images/product-manual-pump.jpg',
      },
      {
        category: 'hardware',
        categoryLabel: 'Dispensers & Stands • Smart',
        badge: 'USB-C Rechargeable',
        title: '20-Litre Smart Electric Water Pump',
        orderName: '20-Litre Smart Electric Water Pump',
        subtitle:
          'One-touch automated water dispenser featuring a 304 stainless steel spout and long-life rechargeable battery.',
        img: 'images/product-electric-pump.jpg',
      },
    ],

    initApp() {
      const scrollTracker = document.getElementById('scroll-tracker');
      const onScroll = () => {
        this.scrolled = window.scrollY > 36;
        if (scrollTracker) {
          const docHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
          const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
          scrollTracker.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      this.$watch('mobileMenuOpen', () => this.refreshIcons());
      this.$watch('modalOpen', (isOpen) => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        this.refreshIcons();
      });
      this.$watch('lightboxOpen', (isOpen) => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        this.refreshIcons();
      });
      this.$watch('activeCategory', () => this.refreshIcons());
      this.$watch('orderSent', () => this.refreshIcons());

      this.$nextTick(() => {
        this.refreshIcons();
        this.initWaterRippleEngine();
        this.initGsapAndScramble();
        this.initDesktopHoverPhysics();
      });
    },

    refreshIcons() {
      this.$nextTick(() => {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      });
    },

    openLightbox(product) {
      this.lightboxItem = product;
      this.lightboxOpen = true;
    },

    openOrderModal(preselectedItemName = '', frequency = 'One-Time') {
      this.orderSent = false;
      this.orderError = '';
      if (frequency) {
        this.orderForm.frequency = frequency;
      }

      if (preselectedItemName) {
        const target = this.orderItems.find(
          (item) => item.name.toLowerCase() === preselectedItemName.toLowerCase()
        );
        if (target && target.qty === 0) {
          target.qty = 1;
        }
      }

      this.modalOpen = true;
    },

    incrementItem(index) {
      if (this.orderItems[index]) {
        this.orderItems[index].qty += 1;
        this.orderError = '';
      }
    },

    decrementItem(index) {
      if (this.orderItems[index] && this.orderItems[index].qty > 0) {
        this.orderItems[index].qty -= 1;
      }
    },

    totalItemsCount() {
      return this.orderItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    },

    submitWhatsAppOrder() {
      return this.submitToWhatsApp();
    },

    submitToWhatsApp() {
      this.orderError = '';

      const cleanName = (this.orderForm.name || '').trim();
      const cleanPhone = (this.orderForm.phone || '').trim();
      const cleanAddress = (this.orderForm.address || '').trim();
      const cleanNotes = (this.orderForm.notes || '').trim();

      if (!cleanName || !cleanPhone || !cleanAddress) {
        this.orderError =
          'Please enter your Name, Phone/WhatsApp number, and Lahore delivery address.';
        return;
      }

      const selectedItems = this.orderItems.filter((item) => item.qty > 0);
      if (selectedItems.length === 0) {
        this.orderError =
          'Please add at least 1 bottle pack, 19L refill, or dispenser item to your order.';
        return;
      }

      const itemizedLines = selectedItems
        .map((item, idx) => `${idx + 1}. ${item.name} — Qty: ${item.qty}`)
        .join('\n');

      const receiptLines = [
        'Assalam-o-Alaikum *EVORL* (Lahore Dispatch),',
        'I would like to place an order & confirm pricing:',
        '',
        '*CUSTOMER DETAILS*',
        `• Name: ${cleanName}`,
        `• Phone: ${cleanPhone}`,
        `• Address: ${cleanAddress}`,
        `• Delivery Plan: ${this.orderForm.frequency}`,
        '',
        '*ORDER ITEMS*',
        itemizedLines,
        '',
        `• Total Units: ${this.totalItemsCount()}`,
      ];

      if (cleanNotes) {
        receiptLines.push(`• Delivery Notes: ${cleanNotes}`);
      }

      receiptLines.push(
        '',
        'Sent via EVORL Executive Hydration Portal (Johar Town, Lahore)'
      );

      const encodedMessage = encodeURIComponent(receiptLines.join('\n'));
      const businessWhatsApp = '923204341157';
      this.whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodedMessage}`;
      this.orderSent = true;

      window.open(this.whatsappUrl, '_blank', 'noopener,noreferrer');
    },

    initWaterRippleEngine() {
      const canvas = document.getElementById('water-canvas');
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      let simWidth = 220;
      let simHeight = 140;
      let size = simWidth * simHeight;

      let buffer1 = new Float32Array(size);
      let buffer2 = new Float32Array(size);

      const offscreen = document.createElement('canvas');
      offscreen.width = simWidth;
      offscreen.height = simHeight;
      const offCtx = offscreen.getContext('2d');
      let imgData = offCtx.createImageData(simWidth, simHeight);

      const resizeCanvas = () => {
        const rect = canvas.parentElement
          ? canvas.parentElement.getBoundingClientRect()
          : { width: window.innerWidth, height: window.innerHeight };

        canvas.width = Math.max(1, Math.floor(rect.width));
        canvas.height = Math.max(1, Math.floor(rect.height));

        const aspect = canvas.width / Math.max(1, canvas.height);
        simHeight = 135;
        simWidth = Math.max(140, Math.min(280, Math.round(simHeight * aspect)));
        size = simWidth * simHeight;

        buffer1 = new Float32Array(size);
        buffer2 = new Float32Array(size);

        offscreen.width = simWidth;
        offscreen.height = simHeight;
        imgData = offCtx.createImageData(simWidth, simHeight);
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      const disturb = (normX, normY, radius = 3, strength = 220) => {
        const cx = Math.floor(normX * simWidth);
        const cy = Math.floor(normY * simHeight);
        if (cx < 2 || cx >= simWidth - 2 || cy < 2 || cy >= simHeight - 2) return;

        const r2 = radius * radius;
        for (let y = cy - radius; y <= cy + radius; y++) {
          if (y <= 1 || y >= simHeight - 1) continue;
          const rowOffset = y * simWidth;
          for (let x = cx - radius; x <= cx + radius; x++) {
            if (x <= 1 || x >= simWidth - 1) continue;
            const dx = x - cx;
            const dy = y - cy;
            const d2 = dx * dx + dy * dy;
            if (d2 <= r2) {
              const falloff = 1 - Math.sqrt(d2) / (radius + 0.5);
              buffer1[rowOffset + x] += strength * falloff;
            }
          }
        }
      };

      const handlePointer = (clientX, clientY, strength = 205) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        const nx = (clientX - rect.left) / rect.width;
        const ny = (clientY - rect.top) / rect.height;
        if (nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1) {
          disturb(nx, ny, 3, strength);
        }
      };

      window.addEventListener(
        'mousemove',
        (e) => handlePointer(e.clientX, e.clientY, 185),
        { passive: true }
      );

      window.addEventListener(
        'touchmove',
        (e) => {
          if (e.touches && e.touches.length > 0) {
            handlePointer(e.touches[0].clientX, e.touches[0].clientY, 215);
          }
        },
        { passive: true }
      );

      window.addEventListener(
        'touchstart',
        (e) => {
          if (e.touches && e.touches.length > 0) {
            handlePointer(e.touches[0].clientX, e.touches[0].clientY, 265);
          }
        },
        { passive: true }
      );

      setTimeout(() => {
        disturb(0.68, 0.36, 4, 250);
        disturb(0.42, 0.54, 3, 190);
      }, 150);

      let lastAmbientDrop = 0;
      const damping = 0.968;

      const renderRipples = (timestamp) => {
        if (timestamp - lastAmbientDrop > 1550) {
          lastAmbientDrop = timestamp;
          const rx = 0.18 + Math.random() * 0.68;
          const ry = 0.15 + Math.random() * 0.58;
          disturb(rx, ry, 3, 165 + Math.random() * 65);
        }

        const data = imgData.data;

        for (let y = 1; y < simHeight - 1; y++) {
          const row = y * simWidth;
          const up = row - simWidth;
          const down = row + simWidth;

          for (let x = 1; x < simWidth - 1; x++) {
            const idx = row + x;

            const waveHeight =
              ((buffer1[idx - 1] +
                buffer1[idx + 1] +
                buffer1[up + x] +
                buffer1[down + x]) >>
                1) -
              buffer2[idx];

            const damped = waveHeight * damping;
            buffer2[idx] = damped;

            const dx = buffer2[idx - 1] - buffer2[idx + 1];
            const dy = buffer2[up + x] - buffer2[down + x];
            const slope = dx * 0.65 + dy * 0.85;

            const pixelIdx = idx * 4;

            if (Math.abs(slope) < 0.35) {
              data[pixelIdx] = 248;
              data[pixelIdx + 1] = 250;
              data[pixelIdx + 2] = 252;
              data[pixelIdx + 3] = 0;
            } else if (slope > 0) {
              const intensity = Math.min(1, slope / 90);
              data[pixelIdx] = Math.round(224 + 31 * intensity);
              data[pixelIdx + 1] = Math.round(244 + 11 * intensity);
              data[pixelIdx + 2] = 255;
              data[pixelIdx + 3] = Math.round(intensity * 125);
            } else {
              const depth = Math.min(1, Math.abs(slope) / 105);
              data[pixelIdx] = Math.round(56 - 38 * depth);
              data[pixelIdx + 1] = Math.round(189 - 57 * depth);
              data[pixelIdx + 2] = Math.round(248 - 49 * depth);
              data[pixelIdx + 3] = Math.round(depth * 88);
            }
          }
        }

        const temp = buffer1;
        buffer1 = buffer2;
        buffer2 = temp;

        offCtx.putImageData(imgData, 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

        requestAnimationFrame(renderRipples);
      };

      requestAnimationFrame(renderRipples);
    },

    initGsapAndScramble() {
      const scrambleEl = document.querySelector('.scramble-text');
      if (scrambleEl) {
        const targetText =
          scrambleEl.getAttribute('data-text') || 'Engineered Perfection';
        const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let iteration = 0;

        const scrambleTimer = setInterval(() => {
          scrambleEl.textContent = targetText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return targetText[index];
              return glyphs[Math.floor(Math.random() * glyphs.length)];
            })
            .join('');

          if (iteration >= targetText.length) {
            scrambleEl.textContent = targetText;
            clearInterval(scrambleTimer);
          }
          iteration += 0.45;
        }, 32);
      }

      if (!window.gsap) return;
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      gsap.to('.hero-bg', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: '#home',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const revealItems = gsap.utils.toArray('.reveal-item');
      revealItems.forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            delay: (index % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });

      const maskContainers = gsap.utils.toArray('.mask-reveal');
      maskContainers.forEach((container, idx) => {
        const overlay = container.querySelector('.mask-overlay');
        if (!overlay) return;

        gsap.to(overlay, {
          scaleY: 0,
          duration: 1.25,
          delay: idx * 0.15,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: container,
            start: 'top 84%',
            once: true,
          },
        });
      });
    },

    initDesktopHoverPhysics() {
      const supportsHover = window.matchMedia('(hover: hover)').matches;
      if (!supportsHover) return;

      if (window.VanillaTilt) {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        if (tiltElements.length > 0) {
          window.VanillaTilt.init(tiltElements, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.12,
          });
        }
      }

      document.querySelectorAll('.spotlight-card').forEach((card) => {
        card.addEventListener(
          'mousemove',
          (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
          },
          { passive: true }
        );
      });

      document.querySelectorAll('.magnetic-btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const pullX = (e.clientX - rect.left - rect.width / 2) * 0.28;
          const pullY = (e.clientY - rect.top - rect.height / 2) * 0.28;
          btn.style.transform = `translate3d(${pullX}px, ${pullY}px, 0)`;
        });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'translate3d(0px, 0px, 0)';
        });
      });
    },
  };
}
