document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'JadwalL1A.html';
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

// Untuk Menyalakan Lateral 1A
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
function setHariSabtuL1A(SabTimeIdL1A, SabDurasiIdL1A, SabSwitchIdL1A, SabNotifIdL1A, SabTimerIdL1A) {
    const SabTimeValueL1A = document.getElementById(SabTimeIdL1A).value;
    const SabDurasiValueL1A = document.getElementById(SabDurasiIdL1A).value;
    
    if (SabTimeValueL1A && SabDurasiValueL1A ) {
        const SbdayL1A = 6;
        const SabDataWaktuL1A = { 
            time: SabTimeValueL1A, 
            duration: SabDurasiValueL1A, 
            SbdayL1A: SbdayL1A, 
            SabStartTimeL1A: null };
        
        if (SabSwitchIdL1A === 'SabSwitch1L1A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1A/SabtuL1A`).set(SabDataWaktuL1A);
            document.getElementById(SabNotifIdL1A).innerText = `${SabTimeValueL1A}`;
        };
        SabTampilanWaktuL1A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SabTampilanWaktuL1A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1A/SabtuL1A`).once('value').then(snapshot => {
        const SabKondisi1L1A = snapshot.val();
        if(SabKondisi1L1A){
            document.getElementById('SabTextJam1L1A').innerText = `${SabKondisi1L1A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1A/SabtuL1A`).once('value').then(snapshot => {
            const SabKondisi1L1A = snapshot.val();
            if (SabKondisi1L1A) SabCekWaktuL1A(SabKondisi1L1A, 'SabSwitch1L1A', 'SabTimer1L1A');
        });
    }, 1000);
}

function SabCekWaktuL1A(SabDataWaktuL1A, SabSwitchIdL1A, SabTimerIdL1A) {
    const SabCurrentTimeL1A = new Date();
    const SabCurrentDayL1A = SabCurrentTimeL1A.getDay();
    const SabCurrentHourL1A = SabCurrentTimeL1A.toTimeString().slice(0, 5); 

    if (SabCurrentDayL1A === SabDataWaktuL1A.SbdayL1A && SabCurrentHourL1A === SabDataWaktuL1A.time) {
        if (!SabDataWaktuL1A.SabStartTimeL1A) {
            SabDataWaktuL1A.SabStartTimeL1A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1A/SabtuL1A`).set(SabDataWaktuL1A);
        }
        document.getElementById(SabSwitchIdL1A).checked = true;

        const SabStartTimeL1A = new Date(SabDataWaktuL1A.SabStartTimeL1A);
        const SabDetikLewatL1A = Math.floor((SabCurrentTimeL1A - SabStartTimeL1A) / 1000);
        const SabRemainingDetikL1A = SabDataWaktuL1A.duration * 60 - SabDetikLewatL1A;

        if (SabRemainingDetikL1A > 0) {
            SabStartTimerL1A(SabTimerIdL1A, SabRemainingDetikL1A, SabSwitchIdL1A);
            controlLED("Lateral1", "L1A");
        } else {
            SabResetWaktuL1A(SabSwitchIdL1A, SabTimerIdL1A);
        }
    }
}

function SabResetWaktuL1A(SabSwitchIdL1A, SabTimerIdL1A) {
    document.getElementById(SabSwitchIdL1A).checked = false;
    firebase.database().ref(`DataWaktuL1A/SabtuL1A`).set(null);
    controlLED("Lateral1", "OFF");
}

function SabStartTimerL1A(SabTimerIdL1A, SabInSecL1A, SabSwitchIdL1A) {
    let SabRemainingWakL1A = SabInSecL1A;

    const SabTimerIntervalL1A = setInterval(() => {
        const Menit = Math.floor(SabRemainingWakL1A / 60);
        const Detik = SabRemainingWakL1A % 60;
        document.getElementById(SabTimerIdL1A).innerText = `${Menit}: ${Detik}`;
        
        SabRemainingWakL1A--;

        if(SabRemainingWakL1A < 0){
            clearInterval(SabTimerIntervalL1A);
            SabResetWaktuL1A(SabSwitchIdL1A, SabTimerIdL1A);
            firebase.database().ref(`Timer/TimerEnd`).set(SabRemainingWakL1A);
            document.getElementById('SabTimer1L1A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SabTampilanWaktuL1A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1A/SabtuL1A`).set(null);
    document.getElementById('SabTextJam1L1A').innerText = '--:--';
});
