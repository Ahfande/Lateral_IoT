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
function setHariRabuL2P(RabTimeIdL2P, RabDurasiIdL2P, RabSwitchIdL2P, RabNotifIdL2P, RabTimerIdL2P) {
    const RabTimeValueL2P = document.getElementById(RabTimeIdL2P).value;
    const RabDurasiValueL2P = document.getElementById(RabDurasiIdL2P).value;
    
    if (RabTimeValueL2P && RabDurasiValueL2P ) {
        const RdayL2P = 3;
        const RabDataWaktuL2P = { 
            time: RabTimeValueL2P, 
            duration: RabDurasiValueL2P, 
            RdayL2P: RdayL2P, 
            RabStartTimeL2P: null };
        
        if (RabSwitchIdL2P === 'RabSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/RabuL2P`).set(RabDataWaktuL2P);
            document.getElementById(RabNotifIdL2P).innerText = `${RabTimeValueL2P}`;
        };
        RabTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function RabTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/RabuL2P`).once('value').then(snapshot => {
        const RabKondisi1L2P = snapshot.val();
        if(RabKondisi1L2P){
            document.getElementById('RabTextJam1L2P').innerText = `${RabKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/RabuL2P`).once('value').then(snapshot => {
            const RabKondisi1L2P = snapshot.val();
            if (RabKondisi1L2P) RabCekWaktuL2P(RabKondisi1L2P, 'RabSwitch1L2P', 'RabTimer1L2P');
        });
    }, 1000);
}

function RabCekWaktuL2P(RabDataWaktuL2P, RabSwitchIdL2P, RabTimerIdL2P) {
    const RabCurrentTimeL2P = new Date();
    const RabCurrentDayL2P = RabCurrentTimeL2P.getDay();
    const RabCurrentHourL2P = RabCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (RabCurrentDayL2P === RabDataWaktuL2P.RdayL2P && RabCurrentHourL2P === RabDataWaktuL2P.time) {
        if (!RabDataWaktuL2P.RabStartTimeL2P) {
            RabDataWaktuL2P.RabStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/RabuL2P`).set(RabDataWaktuL2P);
        }
        document.getElementById(RabSwitchIdL2P).checked = true;

        const RabStartTimeL2P = new Date(RabDataWaktuL2P.RabStartTimeL2P);
        const RabDetikLewatL2P = Math.floor((RabCurrentTimeL2P - RabStartTimeL2P) / 1000);
        const RabRemainingDetikL2P = RabDataWaktuL2P.duration * 60 - RabDetikLewatL2P;

        if (RabRemainingDetikL2P > 0) {
            RabStartTimerL2P(RabTimerIdL2P, RabRemainingDetikL2P, RabSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            RabResetWaktuL2P(RabSwitchIdL2P, RabTimerIdL2P);
        }
    }
}

function RabResetWaktuL2P(RabSwitchIdL2P, RabTimerIdL2P) {
    document.getElementById(RabSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/RabuL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function RabStartTimerL2P(RabTimerIdL2P, RabInSecL2P, RabSwitchIdL2P) {
    let RabRemainingWakL2P = RabInSecL2P;

    const RabTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(RabRemainingWakL2P / 60);
        const Detik = RabRemainingWakL2P % 60;
        document.getElementById(RabTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        RabRemainingWakL2P--;

        if(RabRemainingWakL2P < 0){
            clearInterval(RabTimerIntervalL2P);
            RabResetWaktuL2P(RabSwitchIdL2P, RabTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(RabRemainingWakL2P);
            document.getElementById('RabTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = RabTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/RabuL2P`).set(null);
    document.getElementById('RabTextJam1L2P').innerText = '--:--';
});
