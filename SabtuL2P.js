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
function setHariSabtuL2P(SabTimeIdL2P, SabDurasiIdL2P, SabSwitchIdL2P, SabNotifIdL2P, SabTimerIdL2P) {
    const SabTimeValueL2P = document.getElementById(SabTimeIdL2P).value;
    const SabDurasiValueL2P = document.getElementById(SabDurasiIdL2P).value;
    
    if (SabTimeValueL2P && SabDurasiValueL2P ) {
        const SbdayL2P = 6;
        const SabDataWaktuL2P = { 
            time: SabTimeValueL2P, 
            duration: SabDurasiValueL2P, 
            SbdayL2P: SbdayL2P, 
            SabStartTimeL2P: null };
        
        if (SabSwitchIdL2P === 'SabSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/SabtuL2P`).set(SabDataWaktuL2P);
            document.getElementById(SabNotifIdL2P).innerText = `${SabTimeValueL2P}`;
        };
        SabTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SabTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/SabtuL2P`).once('value').then(snapshot => {
        const SabKondisi1L2P = snapshot.val();
        if(SabKondisi1L2P){
            document.getElementById('SabTextJam1L2P').innerText = `${SabKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/SabtuL2P`).once('value').then(snapshot => {
            const SabKondisi1L2P = snapshot.val();
            if (SabKondisi1L2P) SabCekWaktuL2P(SabKondisi1L2P, 'SabSwitch1L2P', 'SabTimer1L2P');
        });
    }, 1000);
}

function SabCekWaktuL2P(SabDataWaktuL2P, SabSwitchIdL2P, SabTimerIdL2P) {
    const SabCurrentTimeL2P = new Date();
    const SabCurrentDayL2P = SabCurrentTimeL2P.getDay();
    const SabCurrentHourL2P = SabCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (SabCurrentDayL2P === SabDataWaktuL2P.SbdayL2P && SabCurrentHourL2P === SabDataWaktuL2P.time) {
        if (!SabDataWaktuL2P.SabStartTimeL2P) {
            SabDataWaktuL2P.SabStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/SabtuL2P`).set(SabDataWaktuL2P);
        }
        document.getElementById(SabSwitchIdL2P).checked = true;

        const SabStartTimeL2P = new Date(SabDataWaktuL2P.SabStartTimeL2P);
        const SabDetikLewatL2P = Math.floor((SabCurrentTimeL2P - SabStartTimeL2P) / 1000);
        const SabRemainingDetikL2P = SabDataWaktuL2P.duration * 60 - SabDetikLewatL2P;

        if (SabRemainingDetikL2P > 0) {
            SabStartTimerL2P(SabTimerIdL2P, SabRemainingDetikL2P, SabSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            SabResetWaktuL2P(SabSwitchIdL2P, SabTimerIdL2P);
        }
    }
}

function SabResetWaktuL2P(SabSwitchIdL2P, SabTimerIdL2P) {
    document.getElementById(SabSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/SabtuL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function SabStartTimerL2P(SabTimerIdL2P, SabInSecL2P, SabSwitchIdL2P) {
    let SabRemainingWakL2P = SabInSecL2P;

    const SabTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(SabRemainingWakL2P / 60);
        const Detik = SabRemainingWakL2P % 60;
        document.getElementById(SabTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        SabRemainingWakL2P--;

        if(SabRemainingWakL2P < 0){
            clearInterval(SabTimerIntervalL2P);
            SabResetWaktuL2P(SabSwitchIdL2P, SabTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(SabRemainingWakL2P);
            document.getElementById('SabTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SabTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/SabtuL2P`).set(null);
    document.getElementById('SabTextJam1L2P').innerText = '--:--';
});
