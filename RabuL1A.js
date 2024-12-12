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
function setHariRabuL1A(RabTimeIdL1A, RabDurasiIdL1A, RabSwitchIdL1A, RabNotifIdL1A, RabTimerIdL1A) {
    const RabTimeValueL1A = document.getElementById(RabTimeIdL1A).value;
    const RabDurasiValueL1A = document.getElementById(RabDurasiIdL1A).value;
    
    if (RabTimeValueL1A && RabDurasiValueL1A ) {
        const RdayL1A = 3;
        const RabDataWaktuL1A = { 
            time: RabTimeValueL1A, 
            duration: RabDurasiValueL1A, 
            RdayL1A: RdayL1A, 
            RabStartTimeL1A: null };
        
        if (RabSwitchIdL1A === 'RabSwitch1L1A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1A/RabuL1A`).set(RabDataWaktuL1A);
            document.getElementById(RabNotifIdL1A).innerText = `${RabTimeValueL1A}`;
        };
        RabTampilanWaktuL1A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function RabTampilanWaktuL1A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1A/RabuL1A`).once('value').then(snapshot => {
        const RabKondisi1L1A = snapshot.val();
        if(RabKondisi1L1A){
            document.getElementById('RabTextJam1L1A').innerText = `${RabKondisi1L1A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1A/RabuL1A`).once('value').then(snapshot => {
            const RabKondisi1L1A = snapshot.val();
            if (RabKondisi1L1A) RabCekWaktuL1A(RabKondisi1L1A, 'RabSwitch1L1A', 'RabTimer1L1A');
        });
    }, 1000);
}

function RabCekWaktuL1A(RabDataWaktuL1A, RabSwitchIdL1A, RabTimerIdL1A) {
    const RabCurrentTimeL1A = new Date();
    const RabCurrentDayL1A = RabCurrentTimeL1A.getDay();
    const RabCurrentHourL1A = RabCurrentTimeL1A.toTimeString().slice(0, 5); 

    if (RabCurrentDayL1A === RabDataWaktuL1A.RdayL1A && RabCurrentHourL1A === RabDataWaktuL1A.time) {
        if (!RabDataWaktuL1A.RabStartTimeL1A) {
            RabDataWaktuL1A.RabStartTimeL1A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1A/RabuL1A`).set(RabDataWaktuL1A);
        }
        document.getElementById(RabSwitchIdL1A).checked = true;

        const RabStartTimeL1A = new Date(RabDataWaktuL1A.RabStartTimeL1A);
        const RabDetikLewatL1A = Math.floor((RabCurrentTimeL1A - RabStartTimeL1A) / 1000);
        const RabRemainingDetikL1A = RabDataWaktuL1A.duration * 60 - RabDetikLewatL1A;

        if (RabRemainingDetikL1A > 0) {
            RabStartTimerL1A(RabTimerIdL1A, RabRemainingDetikL1A, RabSwitchIdL1A);
            controlLED("Lateral1", "L1A");
        } else {
            RabResetWaktuL1A(RabSwitchIdL1A, RabTimerIdL1A);
        }
    }
}

function RabResetWaktuL1A(RabSwitchIdL1A, RabTimerIdL1A) {
    document.getElementById(RabSwitchIdL1A).checked = false;
    firebase.database().ref(`DataWaktuL1A/RabuL1A`).set(null);
    controlLED("Lateral1", "OFF");
}

function RabStartTimerL1A(RabTimerIdL1A, RabInSecL1A, RabSwitchIdL1A) {
    let RabRemainingWakL1A = RabInSecL1A;

    const RabTimerIntervalL1A = setInterval(() => {
        const Menit = Math.floor(RabRemainingWakL1A / 60);
        const Detik = RabRemainingWakL1A % 60;
        document.getElementById(RabTimerIdL1A).innerText = `${Menit}: ${Detik}`;
        
        RabRemainingWakL1A--;

        if(RabRemainingWakL1A < 0){
            clearInterval(RabTimerIntervalL1A);
            RabResetWaktuL1A(RabSwitchIdL1A, RabTimerIdL1A);
            firebase.database().ref(`Timer/TimerEnd`).set(RabRemainingWakL1A);
            document.getElementById('RabTimer1L1A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = RabTampilanWaktuL1A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1A/RabuL1A`).set(null);
    document.getElementById('RabTextJam1L1A').innerText = '--:--';
});
