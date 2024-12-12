document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'JadwalL2A.html';
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

// Untuk Menyalakan Lateral 2A
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
function setHariSeninL2A(SenTimeIdL2A, SenDurasiIdL2A, SenSwitchIdL2A, SenNotifIdL2A, SenTimerIdL2A) {
    const SenTimeValueL2A = document.getElementById(SenTimeIdL2A).value;
    const SenDurasiValueL2A = document.getElementById(SenDurasiIdL2A).value;
    
    if (SenTimeValueL2A && SenDurasiValueL2A ) {
        const SndayL2A = 1;
        const SenDataWaktuL2A = { 
            time: SenTimeValueL2A, 
            duration: SenDurasiValueL2A, 
            SndayL2A: SndayL2A, 
            SenStartTimeL2A: null };
        
        if (SenSwitchIdL2A === 'SenSwitch1L2A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2A/SeninL2A`).set(SenDataWaktuL2A);
            document.getElementById(SenNotifIdL2A).innerText = `${SenTimeValueL2A}`;
        };
        SenTampilanWaktuL2A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SenTampilanWaktuL2A() {
    firebase.database().ref(`DataWaktuL2A/SeninL2A`).once('value').then(snapshot => {
        const SenKondisi1L2A = snapshot.val();
        if(SenKondisi1L2A){
            document.getElementById('SenTextJam1L2A').innerText = `${SenKondisi1L2A.time}`;
        }
    });

    setInterval(() => {
        firebase.database().ref(`DataWaktuL2A/SeninL2A`).once('value').then(snapshot => {
            const SenKondisi1L2A = snapshot.val();
            if (SenKondisi1L2A) SenCekWaktuL2A(SenKondisi1L2A, 'SenSwitch1L2A', 'SenTimer1L2A');
        });
    }, 1000);
}

function SenCekWaktuL2A(SenDataWaktuL2A, SenSwitchIdL2A, SenTimerIdL2A) {
    const SenCurrentTimeL2A = new Date();
    const SenCurrentDayL2A = SenCurrentTimeL2A.getDay();
    const SenCurrentHourL2A = SenCurrentTimeL2A.toTimeString().slice(0, 5); 

    if (SenCurrentDayL2A === SenDataWaktuL2A.SndayL2A && SenCurrentHourL2A === SenDataWaktuL2A.time) {
        if (!SenDataWaktuL2A.SenStartTimeL2A) {
            SenDataWaktuL2A.SenStartTimeL2A = new Date().toISOString();
            firebase.database().ref(`DataWaktuL2A/SeninL2A`).set(SenDataWaktuL2A);
        }
        document.getElementById(SenSwitchIdL2A).checked = true;

        const SenStartTimeL2A = new Date(SenDataWaktuL2A.SenStartTimeL2A);
        const SenDetikLewatL2A = Math.floor((SenCurrentTimeL2A - SenStartTimeL2A) / 1000);
        const SenRemainingDetikL2A = SenDataWaktuL2A.duration * 60 - SenDetikLewatL2A;

        if (SenRemainingDetikL2A > 0) {
            SenStartTimerL2A(SenTimerIdL2A, SenRemainingDetikL2A, SenSwitchIdL2A);
            controlLED("Lateral2","L2A");
        } else {
            SenResetWaktuL2A(SenSwitchIdL2A, SenTimerIdL2A);
        }
    }
}

function SenResetWaktuL2A(SenSwitchIdL2A, SenTimerIdL2A) {
    document.getElementById(SenSwitchIdL2A).checked = false;
    document.getElementById(SenTimerIdL2A).innerText = '';
    document.getElementById(SenTimerIdL2A).style.display = 'none';

    firebase.database().ref(`DataWaktuL2A/SeninL2A`).set(null);
    controlLED("Lateral2","OFF");
}

function SenStartTimerL2A(SenTimerIdL2A, SenInSecL2A, SenSwitchIdL2A) {
    let SenRemainingWakL2A = SenInSecL2A;

    const SenTimerIntervalL2A = setInterval(() => {
        const Menit = Math.floor(SenRemainingWakL2A / 60);
        const Detik = SenRemainingWakL2A % 60;

        document.getElementById(SenTimerIdL2A).style.display = 'block';
        document.getElementById(SenTimerIdL2A).innerText = `${Menit}: ${Detik}`;
        
        SenRemainingWakL2A--;

        if(SenRemainingWakL2A < 0){
            clearInterval(SenTimerIntervalL2A);
            SenResetWaktuL2A(SenSwitchIdL2A, SenTimerIdL2A);
            firebase.database().ref(`TimerEnd`).set(SenRemainingWakL2A);
        }
    }, 1000);
}

window.onload = SenTampilanWaktuL2A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2A/SeninL2A`).set(null);
    document.getElementById('SenTextJam1L2A').innerText = '--:--';
});
