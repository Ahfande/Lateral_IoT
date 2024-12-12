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
function setHariSabtuL1P(SabTimeIdL1P, SabDurasiIdL1P, SabSwitchIdL1P, SabNotifIdL1P, SabTimerIdL1P) {
    const SabTimeValueL1P = document.getElementById(SabTimeIdL1P).value;
    const SabDurasiValueL1P = document.getElementById(SabDurasiIdL1P).value;
    
    if (SabTimeValueL1P && SabDurasiValueL1P ) {
        const SbdayL1P = 6;
        const SabDataWaktuL1P = { 
            time: SabTimeValueL1P, 
            duration: SabDurasiValueL1P, 
            SbdayL1P: SbdayL1P, 
            SabStartTimeL1P: null };
        
        if (SabSwitchIdL1P === 'SabSwitch1L1P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1P/SabtuL1P`).set(SabDataWaktuL1P);
            document.getElementById(SabNotifIdL1P).innerText = `${SabTimeValueL1P}`;
        };
        SabTampilanWaktuL1P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SabTampilanWaktuL1P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1P/SabtuL1P`).once('value').then(snapshot => {
        const SabKondisi1L1P = snapshot.val();
        if(SabKondisi1L1P){
            document.getElementById('SabTextJam1L1P').innerText = `${SabKondisi1L1P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1P/SabtuL1P`).once('value').then(snapshot => {
            const SabKondisi1L1P = snapshot.val();
            if (SabKondisi1L1P) SabCekWaktuL1P(SabKondisi1L1P, 'SabSwitch1L1P', 'SabTimer1L1P');
        });
    }, 1000);
}

function SabCekWaktuL1P(SabDataWaktuL1P, SabSwitchIdL1P, SabTimerIdL1P) {
    const SabCurrentTimeL1P = new Date();
    const SabCurrentDayL1P = SabCurrentTimeL1P.getDay();
    const SabCurrentHourL1P = SabCurrentTimeL1P.toTimeString().slice(0, 5); 

    if (SabCurrentDayL1P === SabDataWaktuL1P.SbdayL1P && SabCurrentHourL1P === SabDataWaktuL1P.time) {
        if (!SabDataWaktuL1P.SabStartTimeL1P) {
            SabDataWaktuL1P.SabStartTimeL1P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1P/SabtuL1P`).set(SabDataWaktuL1P);
        }
        document.getElementById(SabSwitchIdL1P).checked = true;

        const SabStartTimeL1P = new Date(SabDataWaktuL1P.SabStartTimeL1P);
        const SabDetikLewatL1P = Math.floor((SabCurrentTimeL1P - SabStartTimeL1P) / 1000);
        const SabRemainingDetikL1P = SabDataWaktuL1P.duration * 60 - SabDetikLewatL1P;

        if (SabRemainingDetikL1P > 0) {
            SabStartTimerL1P(SabTimerIdL1P, SabRemainingDetikL1P, SabSwitchIdL1P);
            controlLED("Lateral1","L1P");
        } else {
            SabResetWaktuL1P(SabSwitchIdL1P, SabTimerIdL1P);
        }
    }
}

function SabResetWaktuL1P(SabSwitchIdL1P, SabTimerIdL1P) {
    document.getElementById(SabSwitchIdL1P).checked = false;
    firebase.database().ref(`DataWaktuL1P/SabtuL1P`).set(null);
    controlLED("Lateral1","OFF");
}

function SabStartTimerL1P(SabTimerIdL1P, SabInSecL1P, SabSwitchIdL1P) {
    let SabRemainingWakL1P = SabInSecL1P;

    const SabTimerIntervalL1P = setInterval(() => {
        const Menit = Math.floor(SabRemainingWakL1P / 60);
        const Detik = SabRemainingWakL1P % 60;
        document.getElementById(SabTimerIdL1P).innerText = `${Menit}: ${Detik}`;
        
        SabRemainingWakL1P--;

        if(SabRemainingWakL1P < 0){
            clearInterval(SabTimerIntervalL1P);
            SabResetWaktuL1P(SabSwitchIdL1P, SabTimerIdL1P);
            firebase.database().ref(`Timer/TimerEnd`).set(SabRemainingWakL1P);
            document.getElementById('SabTimer1L1P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SabTampilanWaktuL1P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1P/SabtuL1P`).set(null);
    document.getElementById('SabTextJam1L1P').innerText = '--:--';
});
