import { addMessage, getMessages } from "./chat.js";

const view = document.getElementById("view");

function Home() {
    return `
        <div class="home-view">
            <h2>Gojo Chat</h2>
            <p>Chatea con el único e inigualable Gojo Satoru</p>

            <a href="/chat" data-link class="start-btn"> Empezar Chat</a>
        </div>
    `;
}

function About() {
    return `
    <h2>About</h2>
    <p>Proyecto SPA con Gemini AI</p>
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
                <input id="message-input" placeholder="Escribe un mensaje"/>
                <button id="send-btn">Enviar</button>
            </footer>

        </div>
    `;
}



function setupChatEvents() {

    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");

    if(!input || !button) return;

    button.addEventListener("click", handleSend);

    input.addEventListener("keypress", (e) => {
        if(e.key === "Enter") handleSend();
    });

}



function renderMessages() {
    const  chatContainer = document.getElementById("chat-container");
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
        div.textContent = msg.content;
        chatContainer.appendChild(div);
    });

    if(shouldScroll) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}


async function handleSend() {
    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");

    const text = input.value.trim();
    if(!text) return;
    
    addMessage("user", text);
    input.value = "";
    renderMessages();

    addMessage("bot", "...");
    renderMessages();

    const chatContainer = document.getElementById("chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const messages = getMessages();

        const response = await fetch("/api/functions", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ messages }),
        });

        const data = await response.json();


        const msgs = getMessages();
        msgs[msgs.length - 1].content = data.reply;
        
    } catch(error) {
        const msgs = getMessages();
        msgs[msgs.length - 1].content =
        "Error al contactar con Gojo";
    } finally {
        button.disabled = false;
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