/*
 * JC Blendz Chatbot Widget
 * Usage: <script src="chatbot.js"></script>
 */

(function() {
  // ── CONFIGURATION ──
  const CONFIG = {
    // Business Info
    businessName: 'JC Blendz',
    botName: 'JC Bot',
    greeting: "Yo! 👋 I'm the JC Blendz assistant. What's up?",

    // Brand Colors
    primaryColor: '#C9A84C',
    secondaryColor: '#E2C47A',
    darkBg: '#0E0E0E',

    // Bot Personality
    tone: 'friendly-cool', // 'friendly-cool', 'professional', 'casual'

    // Position: 'bottom-right' or 'bottom-left'
    position: 'bottom-right'
  };

  // ── CHATBOT CLASS ──
  class ChatbotWidget {
    constructor(config) {
      this.config = config;
      this.isOpen = false;
      this.isLoading = false;
      this.messages = [];
      this.render();
      this.bindEvents();
      this.addMessage('assistant', this.config.greeting);
    }

    render() {
      const positionClass = this.config.position === 'bottom-left' ? 'chatbot-left' : 'chatbot-right';

      const html = `
        <div id="chatbot-wrapper" class="chatbot-wrapper ${positionClass}">

          <!-- Chat Button -->
          <button id="chatbot-launcher" class="chatbot-launcher" aria-label="Open chat">
            <div class="chatbot-launcher-ring"></div>
            <div class="chatbot-launcher-ring ring-2"></div>
            <svg class="chatbot-launcher-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="chatbot-badge">●</span>
          </button>

          <!-- Chat Window -->
          <div id="chatbot-window" class="chatbot-window">

            <!-- Header with Gradient -->
            <div class="chatbot-header">
              <div class="chatbot-brand">
                <div class="chatbot-avatar">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                          fill="currentColor" opacity="0.3"/>
                  </svg>
                </div>
                <div class="chatbot-brand-info">
                  <span class="chatbot-brand-name">${this.config.botName}</span>
                  <span class="chatbot-brand-status">
                    <span class="status-dot"></span>
                    Online & ready
                  </span>
                </div>
              </div>
              <button id="chatbot-close" class="chatbot-close-btn" aria-label="Close chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Messages Area -->
            <div id="chatbot-messages" class="chatbot-messages">
              <!-- Messages injected here -->
            </div>

            <!-- Quick Replies -->
            <div id="chatbot-quick-replies" class="chatbot-quick-replies">
              <button class="quick-reply" data-message="What are your hours?">🕐 Hours</button>
              <button class="quick-reply" data-message="How much is a haircut?">💰 Pricing</button>
              <button class="quick-reply" data-message="I want to book an appointment">📅 Book</button>
              <button class="quick-reply" data-message="Where are you located?">📍 Location</button>
            </div>

            <!-- Input Area -->
            <div class="chatbot-input-area">
              <div class="chatbot-input-wrapper">
                <input
                  type="text"
                  id="chatbot-input"
                  class="chatbot-input"
                  placeholder="Type a message..."
                  autocomplete="off"
                />
                <button id="chatbot-send" class="chatbot-send-btn" aria-label="Send message">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
              <div class="chatbot-footer">
                <span>Powered by AI</span>
                <span class="separator">•</span>
                <span>${this.config.businessName}</span>
              </div>
            </div>
          </div>
        </div>

        <style>
          /* ── CSS STYLES ── */
          :host, .chatbot-wrapper * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          .chatbot-wrapper {
            position: fixed;
            z-index: 999999;
            font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          }

          .chatbot-right { bottom: 0; right: 0; }
          .chatbot-left { bottom: 0; left: 0; }

          /* === LAUNCHER BUTTON === */
          .chatbot-launcher {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 64px;
            height: 64px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.secondaryColor} 100%);
            color: #0E0E0E;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            margin: 20px;
          }

          .chatbot-launcher:hover {
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 8px 30px rgba(201, 168, 76, 0.6);
          }

          .chatbot-launcher:active {
            transform: scale(0.95);
          }

          /* Pulsing rings */
          .chatbot-launcher-ring {
            position: absolute;
            inset: -4px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${this.config.primaryColor}, transparent);
            opacity: 0.3;
            animation: pulse-ring 2s ease-out infinite;
          }

          .ring-2 {
            animation-delay: 0.5s;
          }

          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.3; }
            100% { transform: scale(1.4); opacity: 0; }
          }

          .chatbot-launcher-icon {
            width: 28px;
            height: 28px;
            z-index: 2;
          }

          .chatbot-badge {
            position: absolute;
            top: 8px;
            right: 10px;
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            border: 2px solid #0E0E0E;
            animation: pulse-dot 2s ease-in-out infinite;
          }

          @keyframes pulse-dot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          /* === CHAT WINDOW === */
          .chatbot-window {
            position: absolute;
            bottom: 100px;
            right: 20px;
            width: 380px;
            height: 580px;
            max-height: calc(100vh - 140px);
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            opacity: 0;
            transform: scale(0.9) translateY(20px);
            transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: none;
          }

          .chatbot-left .chatbot-window {
            right: auto;
            left: 20px;
          }

          .chatbot-window.active {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: all;
          }

          .chatbot-wrapper.open .chatbot-window {
            opacity: 1;
            transform: scale(1) translateY(0);
            pointer-events: all;
          }

          /* === HEADER === */
          .chatbot-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.secondaryColor} 100%);
            position: relative;
            overflow: hidden;
          }

          .chatbot-header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 200px;
            height: 200px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
          }

          .chatbot-header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -10%;
            width: 150px;
            height: 150px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }

          .chatbot-brand {
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 1;
          }

          .chatbot-avatar {
            width: 44px;
            height: 44px;
            background: rgba(255,255,255,0.2);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
          }

          .chatbot-avatar svg {
            width: 24px;
            height: 24px;
            color: #0E0E0E;
          }

          .chatbot-brand-info {
            display: flex;
            flex-direction: column;
          }

          .chatbot-brand-name {
            font-size: 17px;
            font-weight: 700;
            color: #0E0E0E;
          }

          .chatbot-brand-status {
            font-size: 12px;
            color: rgba(14, 14, 14, 0.8);
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 2px;
          }

          .status-dot {
            width: 6px;
            height: 6px;
            background: #4ade80;
            border-radius: 50%;
            animation: pulse-dot 2s ease-in-out infinite;
          }

          .chatbot-close-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 10px;
            background: rgba(255,255,255,0.2);
            color: #0E0E0E;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            z-index: 1;
          }

          .chatbot-close-btn:hover {
            background: rgba(255,255,255,0.3);
            transform: rotate(90deg);
          }

          .chatbot-close-btn svg {
            width: 18px;
            height: 18px;
          }

          /* === MESSAGES === */
          .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
          }

          .chatbot-messages::-webkit-scrollbar {
            width: 6px;
          }

          .chatbot-messages::-webkit-scrollbar-track {
            background: transparent;
          }

          .chatbot-messages::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 3px;
          }

          .chatbot-message {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
            word-wrap: break-word;
            animation: messageSlide 0.3s ease-out;
          }

          @keyframes messageSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .chatbot-message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.secondaryColor} 100%);
            color: #0E0E0E;
            border-bottom-right-radius: 4px;
            font-weight: 500;
          }

          .chatbot-message.assistant {
            align-self: flex-start;
            background: #e9ecef;
            color: #1a1a2e;
            border-bottom-left-radius: 4px;
          }

          .chatbot-message.error {
            background: linear-gradient(135deg, #fee, #fcc);
            color: #c00;
            align-self: center;
            font-size: 13px;
            text-align: center;
          }

          /* Typing indicator */
          .chatbot-typing {
            display: flex;
            gap: 5px;
            padding: 14px 18px;
            background: #e9ecef;
            border-radius: 18px;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
          }

          .chatbot-typing span {
            width: 8px;
            height: 8px;
            background: linear-gradient(135deg, ${this.config.primaryColor}, ${this.config.secondaryColor});
            border-radius: 50%;
            animation: typingBounce 1.4s ease-in-out infinite;
          }

          .chatbot-typing span:nth-child(2) { animation-delay: 0.2s; }
          .chatbot-typing span:nth-child(3) { animation-delay: 0.4s; }

          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0) scale(1); }
            30% { transform: translateY(-8px) scale(1.1); }
          }

          /* === QUICK REPLIES === */
          .chatbot-quick-replies {
            display: flex;
            gap: 8px;
            padding: 12px 20px;
            background: #ffffff;
            border-top: 1px solid #f0f0f0;
            overflow-x: auto;
            flex-shrink: 0;
          }

          .chatbot-quick-replies::-webkit-scrollbar {
            height: 4px;
          }

          .chatbot-quick-replies::-webkit-scrollbar-thumb {
            background: #e0e0e0;
            border-radius: 2px;
          }

          .quick-reply {
            flex-shrink: 0;
            padding: 8px 14px;
            background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(226,196,122,0.1));
            border: 1px solid rgba(201,168,76,0.3);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            color: ${this.config.primaryColor};
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .quick-reply:hover {
            background: ${this.config.primaryColor};
            color: #0E0E0E;
            transform: translateY(-2px);
          }

          /* === INPUT AREA === */
          .chatbot-input-area {
            padding: 16px 20px;
            background: #ffffff;
            border-top: 1px solid #e9ecef;
            flex-shrink: 0;
          }

          .chatbot-input-wrapper {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .chatbot-input {
            flex: 1;
            padding: 12px 18px;
            background: #f8f9fa;
            border: 2px solid transparent;
            border-radius: 24px;
            font-size: 14px;
            color: #1a1a2e;
            outline: none;
            transition: all 0.2s;
          }

          .chatbot-input::placeholder {
            color: #999;
          }

          .chatbot-input:focus {
            background: #fff;
            border-color: ${this.config.primaryColor};
            box-shadow: 0 0 0 4px rgba(201, 168, 76, 0.1);
          }

          .chatbot-send-btn {
            width: 44px;
            height: 44px;
            border: none;
            border-radius: 50%;
            background: linear-gradient(135deg, ${this.config.primaryColor} 0%, ${this.config.secondaryColor} 100%);
            color: #0E0E0E;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            flex-shrink: 0;
          }

          .chatbot-send-btn:hover {
            transform: scale(1.1) rotate(-10deg);
            box-shadow: 0 4px 15px rgba(201, 168, 76, 0.4);
          }

          .chatbot-send-btn:active {
            transform: scale(0.95);
          }

          .chatbot-send-btn svg {
            width: 20px;
            height: 20px;
          }

          .chatbot-footer {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
            margin-top: 12px;
            font-size: 11px;
            color: #999;
          }

          .separator {
            color: #ddd;
          }

          /* === RESPONSIVE === */
          @media (max-width: 480px) {
            .chatbot-window {
              width: calc(100vw - 40px);
              height: calc(100vh - 120px);
              bottom: 90px;
              right: 20px;
            }

            .chatbot-left .chatbot-window {
              left: 20px;
            }

            .chatbot-launcher {
              width: 56px;
              height: 56px;
              margin: 15px;
            }

            .quick-reply {
              font-size: 11px;
              padding: 6px 12px;
            }
          }
        </style>
      `;

      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container.firstElementChild);
    }

    bindEvents() {
      const launcher = document.getElementById('chatbot-launcher');
      const closeBtn = document.getElementById('chatbot-close');
      const wrapper = document.getElementById('chatbot-wrapper');
      const input = document.getElementById('chatbot-input');
      const sendBtn = document.getElementById('chatbot-send');
      const quickReplies = document.querySelectorAll('.quick-reply');

      // Open chat
      launcher.addEventListener('click', () => {
        wrapper.classList.toggle('open');
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          setTimeout(() => input.focus(), 300);
        }
      });

      // Close chat
      closeBtn.addEventListener('click', () => {
        wrapper.classList.remove('open');
        this.isOpen = false;
      });

      // Send on Enter
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });

      // Send button
      sendBtn.addEventListener('click', () => this.handleSend());

      // Quick replies
      quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
          const message = btn.getAttribute('data-message');
          input.value = message;
          this.handleSend();
        });
      });
    }

    async handleSend() {
      const input = document.getElementById('chatbot-input');
      const message = input.value.trim();

      if (!message || this.isLoading) return;

      input.value = '';
      this.addMessage('user', message);
      this.showTyping();
      this.isLoading = true;

      try {
        const response = await this.callAPI(message);
        this.hideTyping();
        this.addMessage('assistant', response);
      } catch (error) {
        this.hideTyping();
        this.addMessage('error', 'Having trouble connecting. Please try again! 🔌');
        console.error('Chatbot error:', error);
      }

      this.isLoading = false;
    }

    addMessage(role, text) {
      const container = document.getElementById('chatbot-messages');
      const msg = document.createElement('div');
      msg.className = `chatbot-message ${role}`;
      msg.textContent = text;
      container.appendChild(msg);
      container.scrollTop = container.scrollHeight;
    }

    showTyping() {
      const container = document.getElementById('chatbot-messages');
      const typing = document.createElement('div');
      typing.className = 'chatbot-typing';
      typing.id = 'chatbot-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(typing);
      container.scrollTop = container.scrollHeight;
    }

    hideTyping() {
      const typing = document.getElementById('chatbot-typing');
      if (typing) typing.remove();
    }

    async callAPI(message) {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversation: this.messages.slice(-10) // Last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Store in history
      this.messages.push({ role: 'user', content: message });
      this.messages.push({ role: 'assistant', content: data.reply });

      return data.reply;
    }
  }

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.chatbot = new ChatbotWidget(CONFIG);
    });
  } else {
    window.chatbot = new ChatbotWidget(CONFIG);
  }

})();
