const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');
const messagesElement = document.querySelector('#messages');
const sendButton = document.querySelector('#send-button');
const clearButton = document.querySelector('#clear-button');
const history = [];

function addMessage(role, content, temporary = false) {
  const article = document.createElement('article');
  article.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  if (temporary) article.dataset.typing = 'true';
  article.innerHTML = `
    <div class="avatar">${role === 'user' ? 'TÚ' : 'AI'}</div>
    <div class="bubble"><p>${temporary ? 'Pensando...' : ''}</p></div>`;
  if (!temporary) article.querySelector('p').textContent = content;
  messagesElement.appendChild(article);
  messagesElement.scrollTop = messagesElement.scrollHeight;
  return article;
}

function resizeInput() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
}

input.addEventListener('input', resizeInput);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = input.value.trim();
  if (!content || sendButton.disabled) return;

  history.push({ role: 'user', content });
  addMessage('user', content);
  input.value = '';
  resizeInput();
  sendButton.disabled = true;
  const typingMessage = addMessage('assistant', '', true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'La solicitud falló.');
    typingMessage.querySelector('p').textContent = data.reply;
    typingMessage.removeAttribute('data-typing');
    history.push({ role: 'assistant', content: data.reply });
  } catch (error) {
    typingMessage.querySelector('p').textContent = error.message;
    typingMessage.removeAttribute('data-typing');
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
});

clearButton.addEventListener('click', () => {
  history.length = 0;
  messagesElement.innerHTML = '';
  addMessage('assistant', 'Conversación limpia. ¿Qué quieres consultar?');
  input.focus();
});
