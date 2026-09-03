import { addMessage, getMessages } from "./chat.js";

const view = document.getElementById("view");

function Home() {
    return `
        <h2>Home</h2>
        <p>Preparate para chatear con el único e inigualable Gojo Satoru</p>
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


function renderMessages() {
    const  chatContainer = document.getElementById("chat-container");
    if(!chatContainer) return;
    
    const messages = getMessages();

    if(messages.length === 0 ) {
        chatContainer.innerHTML = 
        '<p class="empty-message">Empieza tu chat con Gojo Satoru.</p>';
        return;
    }

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

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function setupChatEvents() {

    const input = document.getElementById("message-input");
    const button = document.getElementById("send-btn");

    if(!input || !button) return;

    async function handleSend(){
        const text = input.value.trim();
        if(!text) return;

        addMessage("user", text);
        input.value = "";
        renderMessages();
        addMessage("bot", "...");
        renderMessages();
    
        try {
            await new Promise((res) => setTimeout(res, 1000));
            
            const messages = getMessages();
            messages[messages.length - 1].content =
            "Frase de Gojo de prueba";
        } catch {
            const messages = getMessages();
            messages[messages.length - 1].content =
            "Frase de Gojo de error";
        }
        
        renderMessages();
    }
    button.addEventListener("click", handleSend);
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    });
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
        view.innerHTML = "<h2>404</h2>"

    }
}
document.addEventListener("click", (e) =>{
    if(e.target.matches("[data-link]")) {
        e.preventDefault();
        const href = e.target.getAttribute("href")

        history.pushState(null, null, href);
        router();
    }
});

window.addEventListener("popstate", router);



router();