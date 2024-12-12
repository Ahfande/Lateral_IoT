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
function setHariSabtuL2A(SabTimeIdL2A, SabDurasiIdL2A, SabSwitchIdL2A, SabNotifIdL2A, SabTimerIdL2A) {
    const SabTimeValueL2A = document.getElementById(SabTimeIdL2A).value;
    const SabDurasiValueL2A = document.getElementById(SabDurasiIdL2A).value;
    
    if (SabTimeValueL2A && SabDurasiValueL2A ) {
        const SbdayL2A = 6;
        const SabDataWaktuL2A = { 
            time: SabTimeValueL2A, 
            duration: SabDurasiValueL2A, 
            SbdayL2A: SbdayL2A, 
            SabStartTimeL2A: null };
        
        if (SabSwitchIdL2A === 'SabSwitch1L2A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2A/SabtuL2A`).set(SabDataWaktuL2A);
            document.getElementById(SabNotifIdL2A).innerText = `${SabTimeValueL2A}`;
        };
        SabTampilanWaktuL2A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SabTampilanWaktuL2A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2A/SabtuL2A`).once('value').then(snapshot => {
        const SabKondisi1L2A = snapshot.val();
        if(SabKondisi1L2A){
            document.getElementById('SabTextJam1L2A').innerText = `${SabKondisi1L2A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2A/SabtuL2A`).once('value').then(snapshot => {
            const SabKondisi1L2A = snapshot.val();
            if (SabKondisi1L2A) SabCekWaktuL2A(SabKondisi1L2A, 'SabSwitch1L2A', 'SabTimer1L2A');
        });
    }, 1000);
}

function SabCekWaktuL2A(SabDataWaktuL2A, SabSwitchIdL2A, SabTimerIdL2A) {
    const SabCurrentTimeL2A = new Date();
    const SabCurrentDayL2A = SabCurrentTimeL2A.getDay();
    const SabCurrentHourL2A = SabCurrentTimeL2A.toTimeString().slice(0, 5); 

    if (SabCurrentDayL2A === SabDataWaktuL2A.SbdayL2A && SabCurrentHourL2A === SabDataWaktuL2A.time) {
        if (!SabDataWaktuL2A.SabStartTimeL2A) {
            SabDataWaktuL2A.SabStartTimeL2A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2A/SabtuL2A`).set(SabDataWaktuL2A);
        }
        document.getElementById(SabSwitchIdL2A).checked = true;

        const SabStartTimeL2A = new Date(SabDataWaktuL2A.SabStartTimeL2A);
        const SabDetikLewatL2A = Math.floor((SabCurrentTimeL2A - SabStartTimeL2A) / 1000);
        const SabRemainingDetikL2A = SabDataWaktuL2A.duration * 60 - SabDetikLewatL2A;

        if (SabRemainingDetikL2A > 0) {
            SabStartTimerL2A(SabTimerIdL2A, SabRemainingDetikL2A, SabSwitchIdL2A);
            controlLED("Lateral2","L2A");
        } else {
            SabResetWaktuL2A(SabSwitchIdL2A, SabTimerIdL2A);
        }
    }
}

function SabResetWaktuL2A(SabSwitchIdL2A, SabTimerIdL2A) {
    document.getElementById(SabSwitchIdL2A).checked = false;
    firebase.database().ref(`DataWaktuL2A/SabtuL2A`).set(null);
    controlLED("Lateral2","OFF");
}

function SabStartTimerL2A(SabTimerIdL2A, SabInSecL2A, SabSwitchIdL2A) {
    let SabRemainingWakL2A = SabInSecL2A;

    const SabTimerIntervalL2A = setInterval(() => {
        const Menit = Math.floor(SabRemainingWakL2A / 60);
        const Detik = SabRemainingWakL2A % 60;
        document.getElementById(SabTimerIdL2A).innerText = `${Menit}: ${Detik}`;
        
        SabRemainingWakL2A--;

        if(SabRemainingWakL2A < 0){
            clearInterval(SabTimerIntervalL2A);
            SabResetWaktuL2A(SabSwitchIdL2A, SabTimerIdL2A);
            firebase.database().ref(`Timer/TimerEnd`).set(SabRemainingWakL2A);
            document.getElementById('SabTimer1L2A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SabTampilanWaktuL2A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2A/SabtuL2A`).set(null);
    document.getElementById('SabTextJam1L2A').innerText = '--:--';
});
