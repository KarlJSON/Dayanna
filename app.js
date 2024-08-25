class DayanaAI {
    constructor() {
        this.knowledge = {};
        this.n = 2; // Usaremos bigramas
        this.personalInfo = {
            nombre: "Dayana",
            edad: 22,
            cumpleaños: "30 de julio",
            añoNacimiento: 2002,
            hermanos: ["Thiago", "Juan Diego"],
            padres: {
                padre: "Juan",
                madre: "Irma"
            },
            apodos: {
                "Juan Diego": "Moño",
                "Irma": "Monchis"
            },
            estudios: "Enfermería en el instituto SAM",
            personalidad: "alegre",
            gustos: ["escuchar música"],
            experienciasRomanticas: "dos enamorados",
            situacionActual: "de viaje en España"
        };
        this.context = {
            lastTopic: "",
            userName: "",
            conversation: []
        };
    }

    // Métodos de aprendizaje, generación, etc.
    processInput(input) {
        input = input.toLowerCase();
        this.context.conversation.push(input);

        if (input.includes("hermano")) {
            return `Tengo dos hermanos: Thiago, que es el menor y lo amo mucho, y Juan Diego, que es el intermedio y le digo de cariño Moño. ¿Tienes hermanos tú?`;
        } else if (input.includes("hola") || input.includes("saludos")) {
            return `¡Hola! ¿Cómo estás? Me alegra mucho hablar contigo. ¿Qué te gustaría saber sobre mí?`;
        } else if (input.includes("cómo estás") || input.includes("cómo te sientes")) {
            return `¡Estoy muy bien, gracias por preguntar! Actualmente estoy de viaje en España y es una experiencia increíble. ¿Y tú cómo estás?`;
        } else if (input.includes("qué haces")) {
            return `En este momento estoy charlando contigo y disfrutando de mi viaje en España. Me encanta conocer gente nueva y aprender cosas nuevas. ¿Qué estás haciendo tú?`;
        } else if (input.includes("donde estas ahora")){
            return 'estoy en españa de viaje :) feliz de la vida'
        }
        else {
            // Usa el método original de generación si no hay una respuesta específica
            const response = this.generate(input);
            if (response.trim() === "") {
                return "Lo siento, no estoy segura de cómo responder a eso. ¿Podrías reformular tu pregunta o preguntarme sobre mi familia, mis estudios o mis intereses?";
            }
            return response;

        }

      
    }
    save() {
        localStorage.setItem('dayanaKnowledge', JSON.stringify(this.knowledge));
        localStorage.setItem('dayanaContext', JSON.stringify(this.context));
    }
    
}

const dayana = new DayanaAI();
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
let isLearningMode = false;

function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `
        <div class="message-text">${message}</div>
        <div class="message-actions">
            <button onclick="copyMessage(this)">Copiar</button>
            <button onclick="editMessage(this)">Editar</button>
            <button onclick="deleteMessage(this)">Eliminar</button>
        </div>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function copyMessage(button) {
    const messageText = button.parentElement.previousElementSibling.textContent;
    navigator.clipboard.writeText(messageText).then(() => {
        alert('Mensaje copiado al portapapeles');
    });
}

function editMessage(button) {
    const messageTextElement = button.parentElement.previousElementSibling;
    const currentText = messageTextElement.textContent;
    const newText = prompt('Editar mensaje:', currentText);
    if (newText !== null) {
        messageTextElement.textContent = newText;
    }
}

function deleteMessage(button) {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        button.closest('.message').remove();
    }
}

function handleUserInput() {
    const message = userInput.value.trim();
    if (message === '') return;

    appendMessage(message, 'user');
    userInput.value = '';

    if (isLearningMode) {
        if (message.toLowerCase().startsWith('aprende:')) {
            const learningContent = message.slice(8).trim();
            dayana.learn(learningContent);
            dayana.save();
            updateLearningStatus();
            appendMessage("He aprendido nuevo contenido. ¡Gracias!", 'bot');
        } else {
            appendMessage("Estoy en modo aprendizaje. Usa 'aprende:' seguido del contenido que quieres que aprenda.", 'bot');
        }
    } else {
        setTimeout(() => {
            const botResponse = dayana.processInput(message);
            appendMessage(botResponse, 'bot');
            dayana.save();
        }, 1000);
    }
}

sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

function updateLearningStatus() {
    const statusElement = document.getElementById('learning-status');
    statusElement.textContent = isLearningMode ? 'Modo Aprendizaje: Activado' : 'Modo Aprendizaje: Desactivado';
}

document.getElementById('learn-mode').addEventListener('click', () => {
    isLearningMode = !isLearningMode;
    updateLearningStatus();
});

// Mensaje de bienvenida
appendMessage("Hola...xd Soy Dayana,Estoy emocionada por charlar contigo. ¿Qué te gustaría saber sobre mí?", 'bot');

// Actualizar el estado de aprendizaje inicial
updateLearningStatus();
