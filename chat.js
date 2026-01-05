const sendBtn = document.querySelector('input[type="button"]');
const userMsg = document.getElementById('msg');
const chatBox = document.querySelector('.chat');

sendBtn.addEventListener("click", sendMessage);

function sendMessage() {
  let message = userMsg.value.trim();
  if (message === "") return;

  addMessage("You", message);
  userMsg.value = "";

  const normalized = normalize(message);

  // 1️⃣ CHECK YOUR DEFINITIONS FIRST
  const custom = getCustomAnswer(normalized);
  if (custom) {
    addMessage(
      "Bot",
      `📘 Definition (2 Marks):\n<b>${custom.term.toUpperCase()}</b>\n${custom.answer}`
    );
    return;
  }

  // 2️⃣ CHECK ICT RELATED
  if (!isICTRelated(message)) {
    addMessage("Bot", "❌ Sorry, I answer only A/L ICT questions.");
    return;
  }

  // 3️⃣ FALLBACK TO AI
  callAPI(message);
}

    const customDefinitions = {
  "computer":
    "A computer is an electronic device that accepts data as input, processes it according to instructions, stores it, and produces information as output.",

  "algorithm":
    "An algorithm is a finite set of step-by-step instructions designed to solve a specific problem.",

  "database":
    "A database is an organized collection of related data that allows easy access, management, and updating.",

  "operating system":
    "An operating system is system software that manages computer hardware and software resources and provides services to users."
};

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[?.,]/g, "")
    .trim();
}

function getCustomAnswer(text) {
  for (let key in customDefinitions) {
    if (text.includes(key)) {
      return {
        term: key,
        answer: customDefinitions[key]
      };
    }
  }
  return null;
}



// FUNCTION: Add message to chat window
function addMessage(sender, text) {
    const div = document.createElement("div");

    if (sender === "You") {
        div.className = "msg user-msg";
    } else {
        div.className = "msg bot-msg";
    }

    div.innerHTML = `<span>${text}</span>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// FUNCTION: Check ICT related content
function isICTRelated(text) {
    const keywords = [
        "computer", "ict", "information", "technology", "network",
        "programming", "code", "software", "hardware", "database",
        "algorithm", "logic", "ai", "web", "html", "css", "java",
        "c#", "python", "system", "it", "internet", "security" ,"input" ,"output","c++"
        ,"computer history"
    ];

    text = text.toLowerCase();

    return keywords.some(word => text.includes(word));
}


// FUNCTION: Send request to ChatGPT API
async function callAPI(question) {
  addMessage("Bot", "⏳ Thinking...");

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();
    addMessage("Bot", data.reply);

  } catch (error) {
    addMessage("Bot", "⚠️ Cannot connect to server.");
  }
}

