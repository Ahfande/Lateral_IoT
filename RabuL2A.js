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
function setHariRabuL2A(RabTimeIdL2A, RabDurasiIdL2A, RabSwitchIdL2A, RabNotifIdL2A, RabTimerIdL2A) {
    const RabTimeValueL2A = document.getElementById(RabTimeIdL2A).value;
    const RabDurasiValueL2A = document.getElementById(RabDurasiIdL2A).value;
    
    if (RabTimeValueL2A && RabDurasiValueL2A ) {
        const RdayL2A = 3;
        const RabDataWaktuL2A = { 
            time: RabTimeValueL2A, 
            duration: RabDurasiValueL2A, 
            RdayL2A: RdayL2A, 
            RabStartTimeL2A: null };
        
        if (RabSwitchIdL2A === 'RabSwitch1L2A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2A/RabuL2A`).set(RabDataWaktuL2A);
            document.getElementById(RabNotifIdL2A).innerText = `${RabTimeValueL2A}`;
        };
        RabTampilanWaktuL2A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function RabTampilanWaktuL2A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2A/RabuL2A`).once('value').then(snapshot => {
        const RabKondisi1L2A = snapshot.val();
        if(RabKondisi1L2A){
            document.getElementById('RabTextJam1L2A').innerText = `${RabKondisi1L2A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2A/RabuL2A`).once('value').then(snapshot => {
            const RabKondisi1L2A = snapshot.val();
            if (RabKondisi1L2A) RabCekWaktuL2A(RabKondisi1L2A, 'RabSwitch1L2A', 'RabTimer1L2A');
        });
    }, 1000);
}

function RabCekWaktuL2A(RabDataWaktuL2A, RabSwitchIdL2A, RabTimerIdL2A) {
    const RabCurrentTimeL2A = new Date();
    const RabCurrentDayL2A = RabCurrentTimeL2A.getDay();
    const RabCurrentHourL2A = RabCurrentTimeL2A.toTimeString().slice(0, 5); 

    if (RabCurrentDayL2A === RabDataWaktuL2A.RdayL2A && RabCurrentHourL2A === RabDataWaktuL2A.time) {
        if (!RabDataWaktuL2A.RabStartTimeL2A) {
            RabDataWaktuL2A.RabStartTimeL2A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2A/RabuL2A`).set(RabDataWaktuL2A);
        }
        document.getElementById(RabSwitchIdL2A).checked = true;

        const RabStartTimeL2A = new Date(RabDataWaktuL2A.RabStartTimeL2A);
        const RabDetikLewatL2A = Math.floor((RabCurrentTimeL2A - RabStartTimeL2A) / 1000);
        const RabRemainingDetikL2A = RabDataWaktuL2A.duration * 60 - RabDetikLewatL2A;

        if (RabRemainingDetikL2A > 0) {
            RabStartTimerL2A(RabTimerIdL2A, RabRemainingDetikL2A, RabSwitchIdL2A);
            controlLED("Lateral2","L2A");
        } else {
            RabResetWaktuL2A(RabSwitchIdL2A, RabTimerIdL2A);
        }
    }
}

function RabResetWaktuL2A(RabSwitchIdL2A, RabTimerIdL2A) {
    document.getElementById(RabSwitchIdL2A).checked = false;
    firebase.database().ref(`DataWaktuL2A/RabuL2A`).set(null);
    controlLED("Lateral2","OFF");
}

function RabStartTimerL2A(RabTimerIdL2A, RabInSecL2A, RabSwitchIdL2A) {
    let RabRemainingWakL2A = RabInSecL2A;

    const RabTimerIntervalL2A = setInterval(() => {
        const Menit = Math.floor(RabRemainingWakL2A / 60);
        const Detik = RabRemainingWakL2A % 60;
        document.getElementById(RabTimerIdL2A).innerText = `${Menit}: ${Detik}`;
        
        RabRemainingWakL2A--;

        if(RabRemainingWakL2A < 0){
            clearInterval(RabTimerIntervalL2A);
            RabResetWaktuL2A(RabSwitchIdL2A, RabTimerIdL2A);
            firebase.database().ref(`Timer/TimerEnd`).set(RabRemainingWakL2A);
            document.getElementById('RabTimer1L2A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = RabTampilanWaktuL2A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2A/RabuL2A`).set(null);
    document.getElementById('RabTextJam1L2A').innerText = '--:--';
});
