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
function setHariRabuL1P(RabTimeIdL1P, RabDurasiIdL1P, RabSwitchIdL1P, RabNotifIdL1P, RabTimerIdL1P) {
    const RabTimeValueL1P = document.getElementById(RabTimeIdL1P).value;
    const RabDurasiValueL1P = document.getElementById(RabDurasiIdL1P).value;
    
    if (RabTimeValueL1P && RabDurasiValueL1P ) {
        const RdayL1P = 3;
        const RabDataWaktuL1P = { 
            time: RabTimeValueL1P, 
            duration: RabDurasiValueL1P, 
            RdayL1P: RdayL1P, 
            RabStartTimeL1P: null };
        
        if (RabSwitchIdL1P === 'RabSwitch1L1P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1P/RabuL1P`).set(RabDataWaktuL1P);
            document.getElementById(RabNotifIdL1P).innerText = `${RabTimeValueL1P}`;
        };
        RabTampilanWaktuL1P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function RabTampilanWaktuL1P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1P/RabuL1P`).once('value').then(snapshot => {
        const RabKondisi1L1P = snapshot.val();
        if(RabKondisi1L1P){
            document.getElementById('RabTextJam1L1P').innerText = `${RabKondisi1L1P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1P/RabuL1P`).once('value').then(snapshot => {
            const RabKondisi1L1P = snapshot.val();
            if (RabKondisi1L1P) RabCekWaktuL1P(RabKondisi1L1P, 'RabSwitch1L1P', 'RabTimer1L1P');
        });
    }, 1000);
}

function RabCekWaktuL1P(RabDataWaktuL1P, RabSwitchIdL1P, RabTimerIdL1P) {
    const RabCurrentTimeL1P = new Date();
    const RabCurrentDayL1P = RabCurrentTimeL1P.getDay();
    const RabCurrentHourL1P = RabCurrentTimeL1P.toTimeString().slice(0, 5); 

    if (RabCurrentDayL1P === RabDataWaktuL1P.RdayL1P && RabCurrentHourL1P === RabDataWaktuL1P.time) {
        if (!RabDataWaktuL1P.RabStartTimeL1P) {
            RabDataWaktuL1P.RabStartTimeL1P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1P/RabuL1P`).set(RabDataWaktuL1P);
        }
        document.getElementById(RabSwitchIdL1P).checked = true;

        const RabStartTimeL1P = new Date(RabDataWaktuL1P.RabStartTimeL1P);
        const RabDetikLewatL1P = Math.floor((RabCurrentTimeL1P - RabStartTimeL1P) / 1000);
        const RabRemainingDetikL1P = RabDataWaktuL1P.duration * 60 - RabDetikLewatL1P;

        if (RabRemainingDetikL1P > 0) {
            RabStartTimerL1P(RabTimerIdL1P, RabRemainingDetikL1P, RabSwitchIdL1P);
            controlLED("Lateral1","L1P");
        } else {
            RabResetWaktuL1P(RabSwitchIdL1P, RabTimerIdL1P);
        }
    }
}

function RabResetWaktuL1P(RabSwitchIdL1P, RabTimerIdL1P) {
    document.getElementById(RabSwitchIdL1P).checked = false;
    firebase.database().ref(`DataWaktuL1P/RabuL1P`).set(null);
    controlLED("Lateral1","OFF");
}

function RabStartTimerL1P(RabTimerIdL1P, RabInSecL1P, RabSwitchIdL1P) {
    let RabRemainingWakL1P = RabInSecL1P;

    const RabTimerIntervalL1P = setInterval(() => {
        const Menit = Math.floor(RabRemainingWakL1P / 60);
        const Detik = RabRemainingWakL1P % 60;
        document.getElementById(RabTimerIdL1P).innerText = `${Menit}: ${Detik}`;
        
        RabRemainingWakL1P--;

        if(RabRemainingWakL1P < 0){
            clearInterval(RabTimerIntervalL1P);
            RabResetWaktuL1P(RabSwitchIdL1P, RabTimerIdL1P);
            firebase.database().ref(`Timer/TimerEnd`).set(RabRemainingWakL1P);
            document.getElementById('RabTimer1L1P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = RabTampilanWaktuL1P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1P/RabuL1P`).set(null);
    document.getElementById('RabTextJam1L1P').innerText = '--:--';
});
