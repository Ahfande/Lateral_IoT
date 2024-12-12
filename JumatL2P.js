document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'JadwalL2P.html';
});
// Server Untuk Menyalakan LED 
const firebaseConfig = {
    apiKey: "AIzaSyDh7h2pepjv8AIPwVKy30y2tQIkKwNOcmU",
    authDomain: "salmon-17.firebaseapp.com",
    databaseURL: "https://salmon-17-default-rtdb.firebaseio.com",
    projectId: "salmon-17",
    storageBucket: "salmon-17.appspot.com",
    messagingSenderId: "809053328128",
    appId: "1:809053328128:web:446c479d6563c5da1c59e5",
};
// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Untuk Menyalakan Lateral 2P
function controlLED(lateral, status) {
    firebase.database().ref(`/${lateral}/status`).set(status)
    .then(() => {
        console.log(`${lateral} set to ${status}`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// HARI SENIN.....
function setHariJumatL2P(JumTimeIdL2P, JumDurasiIdL2P, JumSwitchIdL2P, JumNotifIdL2P, JumTimerIdL2P) {
    const JumTimeValueL2P = document.getElementById(JumTimeIdL2P).value;
    const JumDurasiValueL2P = document.getElementById(JumDurasiIdL2P).value;
    
    if (JumTimeValueL2P && JumDurasiValueL2P ) {
        const JdayL2P = 5;
        const JumDataWaktuL2P = { 
            time: JumTimeValueL2P, 
            duration: JumDurasiValueL2P, 
            JdayL2P: JdayL2P, 
            JumStartTimeL2P: null };
        
        if (JumSwitchIdL2P === 'JumSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/JumatL2P`).set(JumDataWaktuL2P);
            document.getElementById(JumNotifIdL2P).innerText = `${JumTimeValueL2P}`;
        };
        JumTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function JumTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/JumatL2P`).once('value').then(snapshot => {
        const JumKondisi1L2P = snapshot.val();
        if(JumKondisi1L2P){
            document.getElementById('JumTextJam1L2P').innerText = `${JumKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/JumatL2P`).once('value').then(snapshot => {
            const JumKondisi1L2P = snapshot.val();
            if (JumKondisi1L2P) JumCekWaktuL2P(JumKondisi1L2P, 'JumSwitch1L2P', 'JumTimer1L2P');
        });
    }, 1000);
}

function JumCekWaktuL2P(JumDataWaktuL2P, JumSwitchIdL2P, JumTimerIdL2P) {
    const JumCurrentTimeL2P = new Date();
    const JumCurrentDayL2P = JumCurrentTimeL2P.getDay();
    const JumCurrentHourL2P = JumCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (JumCurrentDayL2P === JumDataWaktuL2P.JdayL2P && JumCurrentHourL2P === JumDataWaktuL2P.time) {
        if (!JumDataWaktuL2P.JumStartTimeL2P) {
            JumDataWaktuL2P.JumStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/JumatL2P`).set(JumDataWaktuL2P);
        }
        document.getElementById(JumSwitchIdL2P).checked = true;

        const JumStartTimeL2P = new Date(JumDataWaktuL2P.JumStartTimeL2P);
        const JumDetikLewatL2P = Math.floor((JumCurrentTimeL2P - JumStartTimeL2P) / 1000);
        const JumRemainingDetikL2P = JumDataWaktuL2P.duration * 60 - JumDetikLewatL2P;

        if (JumRemainingDetikL2P > 0) {
            JumStartTimerL2P(JumTimerIdL2P, JumRemainingDetikL2P, JumSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            JumResetWaktuL2P(JumSwitchIdL2P, JumTimerIdL2P);
        }
    }
}

function JumResetWaktuL2P(JumSwitchIdL2P, JumTimerIdL2P) {
    document.getElementById(JumSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/JumatL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function JumStartTimerL2P(JumTimerIdL2P, JumInSecL2P, JumSwitchIdL2P) {
    let JumRemainingWakL2P = JumInSecL2P;

    const JumTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(JumRemainingWakL2P / 60);
        const Detik = JumRemainingWakL2P % 60;
        document.getElementById(JumTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        JumRemainingWakL2P--;

        if(JumRemainingWakL2P < 0){
            clearInterval(JumTimerIntervalL2P);
            JumResetWaktuL2P(JumSwitchIdL2P, JumTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(JumRemainingWakL2P);
            document.getElementById('JumTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = JumTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/JumatL2P`).set(null);
    document.getElementById('JumTextJam1L2P').innerText = '--:--';
});
