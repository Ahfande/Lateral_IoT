console.log('Home Bisa');

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  });
}


// Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC_9DnCr73Z7lnkBta7bOeNFYLfOEnpWl8",
  authDomain: "lateral-45ab9.firebaseapp.com",
  databaseURL: "https://lateral-45ab9-default-rtdb.firebaseio.com",
  projectId: "lateral-45ab9",
  storageBucket: "lateral-45ab9.firebasestorage.app",
  messagingSenderId: "816040638068",
  appId: "1:816040638068:web:f03becaf5e7b2a65880321",
  measurementId: "G-FSH7R15WN9",
};
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Wifi ESP32
firebase.database().ref(`Device/Status/Wifi`).once('value').then(snapshot => {
  if("Connected"){
    console.log("Wifi Aman bang");
    document.getElementById('Wifi').style.backgroundColor = '#4CA771';
  }else{
    document.getElementById('Wifi').style.backgroundColor = '#FF0800';
  }
})

// Pop UP
let activeLateralNumber = null;
function showPopup(lateralNumber) {
  const popup = document.getElementById("popupOverlay");
  const popupTitle = popup.querySelector(".popup-header h2");
  popupTitle.textContent = `Lateral ${lateralNumber}`;
  popup.classList.add("active");
  document.body.style.overflow = "hidden";
  activeLateralNumber = lateralNumber;
}

function closePopup() {
  const popup = document.getElementById("popupOverlay");
  popup.classList.remove("active");
  document.body.style.overflow = "auto";
  activeLateralNumber = null;
}

function navigateToSchedule(type) {
  if (activeLateralNumber === null) return;
  const pages = {
    penyiraman: {
      1: 'JadwalL1A.html',
      2: 'JadwalL2A.html',
      3: 'JadwalL3A.html',
      4: 'JadwalL4A.html'
    },
    pemupukan: {
      1: 'JadwalL1P.html',
      2: 'JadwalL2P.html',
      3: 'JadwalL3P.html',
      4: 'JadwalL4P.html'
    }
  };

  const targetPage = pages[type][activeLateralNumber];
  if (targetPage) {
    window.location.href = targetPage;
  }
}

document.querySelectorAll(".boxLateral").forEach((box, index) => {
  const clickableElements = box.querySelectorAll(".circle, .TextLateral");
  clickableElements.forEach((element) => {
    element.addEventListener("click", () => {
      showPopup(index + 1);
    });
  });
  
  const inputField = box.querySelector("input");
  inputField.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.querySelector(".close-btn").addEventListener("click", closePopup);

document.getElementById("popupOverlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("popupOverlay")) {
    closePopup();
  }
});

document.getElementById("penyiraman").addEventListener("click", () => {
  navigateToSchedule('penyiraman');
});

document.getElementById("pemupukan").addEventListener("click", () => {
  navigateToSchedule('pemupukan');
});



document.getElementById("form1").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral1", "inputField1");
});

document.getElementById("form2").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral2", "inputField2");
});

document.getElementById("form3").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral3", "inputField3");
});

document.getElementById("form4").addEventListener("submit", function (event) {
  event.preventDefault();
  saveInputToFirebase("lateral4", "inputField4");
});

function loadLastInput(lateralId, inputId) {
  const inputRef = database.ref("Tumbuhan/" + lateralId).limitToLast(1);
  inputRef
    .once("value")
    .then((snapshot) => {
      if (snapshot.exists()) {
        const lastInput = snapshot.val();
        const inputText = Object.values(lastInput)[0].name; 
        document.getElementById(inputId).value = inputText; 
      }
    })
    .catch((error) => {
      console.error("Error getting last input: ", error);
    });
}


loadLastInput("lateral1", "inputField1");
loadLastInput("lateral2", "inputField2");
loadLastInput("lateral3", "inputField3");
loadLastInput("lateral4", "inputField4");


function saveInputToFirebase(lateralId, inputFieldId) {
  const inputField = document.getElementById(inputFieldId);
  const inputValue = inputField.value;

  database
    .ref("Tumbuhan/" + lateralId)
    .push({
      name: inputValue,
      timestamp: Date.now(),
    })
    .then(() => {
      console.log("Data berhasil disimpan ke Firebase");
    })
    .catch((error) => {
      console.error("Gagal menyimpan data ke Firebase", error);
    });

  inputField.value = inputValue;
}


// CUACA
const latitude = -7.8167;
const longitude = 112.0167;

// URL API Open-Meteo
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m&current_weather=true`;

async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();

        const suhu= data.current_weather.temperature;
        const angin = data.current_weather.windspeed; 
        const kelembapan = data.hourly.relative_humidity_2m[0];

        document.getElementById('suhu').textContent = `${suhu.toFixed(0)}⁰`;
        document.getElementById('kelembapan').textContent = `${kelembapan}%`;
        document.getElementById('angin').textContent = `${angin.toFixed(0)}km/h`;
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}
fetchWeather();