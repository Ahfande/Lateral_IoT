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
function setHariSeninL2P(SenTimeIdL2P, SenDurasiIdL2P, SenSwitchIdL2P, SenNotifIdL2P, SenTimerIdL2P) {
    const SenTimeValueL2P = document.getElementById(SenTimeIdL2P).value;
    const SenDurasiValueL2P = document.getElementById(SenDurasiIdL2P).value;
    
    if (SenTimeValueL2P && SenDurasiValueL2P ) {
        const SndayL2P = 1;
        const SenDataWaktuL2P = { 
            time: SenTimeValueL2P, 
            duration: SenDurasiValueL2P, 
            SndayL2P: SndayL2P, 
            SenStartTimeL2P: null };
        
        if (SenSwitchIdL2P === 'SenSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/SeninL2P`).set(SenDataWaktuL2P);
            document.getElementById(SenNotifIdL2P).innerText = `${SenTimeValueL2P}`;
        };
        SenTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SenTampilanWaktuL2P() {
    firebase.database().ref(`DataWaktuL2P/SeninL2P`).once('value').then(snapshot => {
        const SenKondisi1L2P = snapshot.val();
        if(SenKondisi1L2P){
            document.getElementById('SenTextJam1L2P').innerText = `${SenKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        firebase.database().ref(`DataWaktuL2P/SeninL2P`).once('value').then(snapshot => {
            const SenKondisi1L2P = snapshot.val();
            if (SenKondisi1L2P) SenCekWaktuL2P(SenKondisi1L2P, 'SenSwitch1L2P', 'SenTimer1L2P');
        });
    }, 1000);
}

function SenCekWaktuL2P(SenDataWaktuL2P, SenSwitchIdL2P, SenTimerIdL2P) {
    const SenCurrentTimeL2P = new Date();
    const SenCurrentDayL2P = SenCurrentTimeL2P.getDay();
    const SenCurrentHourL2P = SenCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (SenCurrentDayL2P === SenDataWaktuL2P.SndayL2P && SenCurrentHourL2P === SenDataWaktuL2P.time) {
        if (!SenDataWaktuL2P.SenStartTimeL2P) {
            SenDataWaktuL2P.SenStartTimeL2P = new Date().toISOString();
            firebase.database().ref(`DataWaktuL2P/SeninL2P`).set(SenDataWaktuL2P);
        }
        document.getElementById(SenSwitchIdL2P).checked = true;

        const SenStartTimeL2P = new Date(SenDataWaktuL2P.SenStartTimeL2P);
        const SenDetikLewatL2P = Math.floor((SenCurrentTimeL2P - SenStartTimeL2P) / 1000);
        const SenRemainingDetikL2P = SenDataWaktuL2P.duration * 60 - SenDetikLewatL2P;

        if (SenRemainingDetikL2P > 0) {
            SenStartTimerL2P(SenTimerIdL2P, SenRemainingDetikL2P, SenSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            SenResetWaktuL2P(SenSwitchIdL2P, SenTimerIdL2P);
        }
    }
}

function SenResetWaktuL2P(SenSwitchIdL2P, SenTimerIdL2P) {
    document.getElementById(SenSwitchIdL2P).checked = false;
    document.getElementById(SenTimerIdL2P).innerText = '';
    document.getElementById(SenTimerIdL2P).style.display = 'none';

    firebase.database().ref(`DataWaktuL2P/SeninL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function SenStartTimerL2P(SenTimerIdL2P, SenInSecL2P, SenSwitchIdL2P) {
    let SenRemainingWakL2P = SenInSecL2P;

    const SenTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(SenRemainingWakL2P / 60);
        const Detik = SenRemainingWakL2P % 60;

        document.getElementById(SenTimerIdL2P).style.display = 'block';
        document.getElementById(SenTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        SenRemainingWakL2P--;

        if(SenRemainingWakL2P < 0){
            clearInterval(SenTimerIntervalL2P);
            SenResetWaktuL2P(SenSwitchIdL2P, SenTimerIdL2P);
            firebase.database().ref(`TimerEnd`).set(SenRemainingWakL2P);
        }
    }, 1000);
}

window.onload = SenTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/SeninL2P`).set(null);
    document.getElementById('SenTextJam1L2P').innerText = '--:--';
});
