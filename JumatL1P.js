document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'JadwalL1P.html';
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

// Untuk Menyalakan Lateral 1P
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
function setHariJumatL1P(JumTimeIdL1P, JumDurasiIdL1P, JumSwitchIdL1P, JumNotifIdL1P, JumTimerIdL1P) {
    const JumTimeValueL1P = document.getElementById(JumTimeIdL1P).value;
    const JumDurasiValueL1P = document.getElementById(JumDurasiIdL1P).value;
    
    if (JumTimeValueL1P && JumDurasiValueL1P ) {
        const JdayL1P = 5;
        const JumDataWaktuL1P = { 
            time: JumTimeValueL1P, 
            duration: JumDurasiValueL1P, 
            JdayL1P: JdayL1P, 
            JumStartTimeL1P: null };
        
        if (JumSwitchIdL1P === 'JumSwitch1L1P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1P/JumatL1P`).set(JumDataWaktuL1P);
            document.getElementById(JumNotifIdL1P).innerText = `${JumTimeValueL1P}`;
        };
        JumTampilanWaktuL1P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function JumTampilanWaktuL1P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1P/JumatL1P`).once('value').then(snapshot => {
        const JumKondisi1L1P = snapshot.val();
        if(JumKondisi1L1P){
            document.getElementById('JumTextJam1L1P').innerText = `${JumKondisi1L1P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1P/JumatL1P`).once('value').then(snapshot => {
            const JumKondisi1L1P = snapshot.val();
            if (JumKondisi1L1P) JumCekWaktuL1P(JumKondisi1L1P, 'JumSwitch1L1P', 'JumTimer1L1P');
        });
    }, 1000);
}

function JumCekWaktuL1P(JumDataWaktuL1P, JumSwitchIdL1P, JumTimerIdL1P) {
    const JumCurrentTimeL1P = new Date();
    const JumCurrentDayL1P = JumCurrentTimeL1P.getDay();
    const JumCurrentHourL1P = JumCurrentTimeL1P.toTimeString().slice(0, 5); 

    if (JumCurrentDayL1P === JumDataWaktuL1P.JdayL1P && JumCurrentHourL1P === JumDataWaktuL1P.time) {
        if (!JumDataWaktuL1P.JumStartTimeL1P) {
            JumDataWaktuL1P.JumStartTimeL1P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1P/JumatL1P`).set(JumDataWaktuL1P);
        }
        document.getElementById(JumSwitchIdL1P).checked = true;

        const JumStartTimeL1P = new Date(JumDataWaktuL1P.JumStartTimeL1P);
        const JumDetikLewatL1P = Math.floor((JumCurrentTimeL1P - JumStartTimeL1P) / 1000);
        const JumRemainingDetikL1P = JumDataWaktuL1P.duration * 60 - JumDetikLewatL1P;

        if (JumRemainingDetikL1P > 0) {
            JumStartTimerL1P(JumTimerIdL1P, JumRemainingDetikL1P, JumSwitchIdL1P);
            controlLED("Lateral1","L1P");
        } else {
            JumResetWaktuL1P(JumSwitchIdL1P, JumTimerIdL1P);
        }
    }
}

function JumResetWaktuL1P(JumSwitchIdL1P, JumTimerIdL1P) {
    document.getElementById(JumSwitchIdL1P).checked = false;
    firebase.database().ref(`DataWaktuL1P/JumatL1P`).set(null);
    controlLED("Lateral1","OFF");
}

function JumStartTimerL1P(JumTimerIdL1P, JumInSecL1P, JumSwitchIdL1P) {
    let JumRemainingWakL1P = JumInSecL1P;

    const JumTimerIntervalL1P = setInterval(() => {
        const Menit = Math.floor(JumRemainingWakL1P / 60);
        const Detik = JumRemainingWakL1P % 60;
        document.getElementById(JumTimerIdL1P).innerText = `${Menit}: ${Detik}`;
        
        JumRemainingWakL1P--;

        if(JumRemainingWakL1P < 0){
            clearInterval(JumTimerIntervalL1P);
            JumResetWaktuL1P(JumSwitchIdL1P, JumTimerIdL1P);
            firebase.database().ref(`Timer/TimerEnd`).set(JumRemainingWakL1P);
            document.getElementById('JumTimer1L1P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = JumTampilanWaktuL1P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1P/JumatL1P`).set(null);
    document.getElementById('JumTextJam1L1P').innerText = '--:--';
});
