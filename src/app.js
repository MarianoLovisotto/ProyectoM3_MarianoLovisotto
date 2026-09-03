import { addMessage, clearMessages, getMessages, updateLastMessage } from "./chat.js";

const view = document.getElementById("view");

function Home() {
    return `
        <section class ="home-view">

        <div class="hero-card">

            <img src="/src/Gojo.logo.png" alt="Gojo logo" class="hero-logo" />

            <h1>Gojo Chat</h1>

            <p class="hero-text">
            Habla con el único e inigualable Gojo Satoru
            </p>

            <a href="/chat" data-link class="start-btn">
                Empezar chat
            </a>
        </div>
        
        </section>
    `;
}

function About() {
    return `
    <section class="about-view">

    <div class="about-card">

        <div class="character-card">
            <img src="/src/Gojo.logo.png" alt="Gojo logo" class="character-logo"/>

            <div>
                <span class="character-label">Conoce al personaje</span>
                <h2>Gojo Satoru</h2>
                <p>El hechicero mas fuerte de la actualidad, pero no es solo fuerte;
                también es: gracioso, guapo y con un gran sentido de la moda... y para nada me obligo a escribir esto</p>
            </div>
        </div>
        
        <h3>Acerca de Gojo Chat</h3>
        
        <p>Gojo Chat es una SPA desarrollada con JavaScript Vanilla, History API y Gemini AI.</p>
        <p>La web busca imitar lo que sería una conversación con el hechiero mas ferte de la actualidad.</p>

        <p>Teconologías utilizadas:</p>

        <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript Vanilla</li>
            <li>Vercel Functions</li>
            <li>Gemini AI</li>
            <li>Vitest</li>
        </ul>

    </div>
    
    
    </section>
    `;
}

function Chat(){
    return `
        <div class="chat-view">
        
            <div class="chat-header">
                <div>
                <h1>Gojo Satoru</h1>
                <span class="status">Online</span>
                </div>
            </div>

            <main class="chat-container" id="chat-container"></main>

            <footer class="chat-input">
                <input id="message-input" placeholder="Escribe un mensaje" maxlength="300"/>
                <button id="send-btn">Enviar</button>
                <button id="clear-btn">Borrar</button>
            </footer>

        </div>
    `;
}



function setupChatEvents() {

    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");
    const clearBtn = document.getElementById("clear-btn");

    if(!input || !button || !clearBtn) return;
    input.focus();

    button.addEventListener("click", handleSend);

    clearBtn.addEventListener("click", () => {
        clearMessages();
        renderMessages();
    })

    input.addEventListener("keypress", (e) => {
        if(e.key === "Enter" && !isSending) handleSend();
    });

}



function renderMessages() {
    const chatContainer = document.getElementById("chat-container");
    if(!chatContainer) return;
    
    const messages = getMessages();

    if(messages.length === 0 ) {
        chatContainer.innerHTML = 
        '<p class="empty-message">Empieza tu chat con Gojo Satoru.</p>';
        return;
    }

    const shouldScroll = isNearBottom(chatContainer)

    chatContainer.innerHTML = "";

    const spacer = document.createElement("div");
    spacer.style.flex = "1";
    chatContainer.appendChild(spacer)

    messages.forEach((msg) => {
        
        const div = document.createElement("div");
        
        div.classList.add("message", msg.role === "user" ? "user" : "bot")
        
        if(msg.role === "bot") {
            div.innerHTML = `
                <div class="bot-message-content">
                    <img src="src/Gojo.logo.png" alt="Gojo Logo" class="bot-logo"/>
                    <span>${msg.content}</span>
                </div>

            `;
        }else {
            div.textContent = msg.content;
        }

        chatContainer.appendChild(div);
    });

    if(shouldScroll) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function showChatAlert(message) {
    const alert = document.getElementById("chat-alert");
    if(!alert) return;

    alert.textContent = message;
    alert.classList.remove("hidden");
}

function hideChatAlert() {
    const alert = document.getElementById("chat-alert");
    if(!alert) return;

    alert.textContent = "";
    alert.classList.add("hidden");
}

const DEBUG_FORCE_ERROR = false; // Pueden testear el mensaje de error al modificarlo por true

let isSending = false;

async function handleSend() {

    if(isSending) return;
    hideChatAlert();
    isSending = true;

    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");

    const text = input.value.trim();
    if(!text) {
        input.focus();
        isSending = false;
        return;
    }

    button.disabled = true;

    
    addMessage("user", text);
    input.value = "";
    renderMessages();

    addMessage("bot", "Escribiendo...");
    renderMessages();

    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const messages = getMessages().filter((msg) => msg.content !== "Escribiendo..."
    );

        if(DEBUG_FORCE_ERROR) {
            throw new Error("Error forzado para probar aviso visual")
        }

        const controller = new AbortController();

        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 15000);

        const response = await fetch("/api/functions", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ messages }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        updateLastMessage(data.reply)

    } catch(error) {
        updateLastMessage("No se pudo contactar con Gojo en este momento.");

        showChatAlert("No se pudo contactar con Gojo en este momento. Intente luego de unos minutos.");

    } finally {
        button.disabled = false;
        isSending = false
    }

    renderMessages();
}



function router() {
    const path = window.location.pathname;

    if(path === "/" || path === "/home"){
        view.innerHTML = Home();
    }else if(path === "/chat"){
        view.innerHTML = Chat();
        renderMessages();
        setupChatEvents();
    }else if(path === "/about"){
        view.innerHTML = About();
    }else{
        view.innerHTML = "<h1>404 - Página no encontrada</h1>";
    }
}


document.addEventListener("click", (e) =>{
    const link = e.target.closest("[data-link]");

    if(link) {
        e.preventDefault();
        const href = link.getAttribute("href");

        history.pushState(null, null, href);
        router();
    }
});

window.addEventListener("popstate", router);


router();

function isNearBottom(container) {
    const threshold = 50;
    return (
        container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    );
}