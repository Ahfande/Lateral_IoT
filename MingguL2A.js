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
function setHariMingguL2A(MinTimeIdL2A, MinDurasiIdL2A, MinSwitchIdL2A, MinNotifIdL2A, MinTimerIdL2A) {
    const MinTimeValueL2A = document.getElementById(MinTimeIdL2A).value;
    const MinDurasiValueL2A = document.getElementById(MinDurasiIdL2A).value;
    
    if (MinTimeValueL2A && MinDurasiValueL2A ) {
        const MdayL2A = 0;
        const MinDataWaktuL2A = { 
            time: MinTimeValueL2A, 
            duration: MinDurasiValueL2A, 
            MdayL2A: MdayL2A, 
            MinStartTimeL2A: null };
        
        if (MinSwitchIdL2A === 'MinSwitch1L2A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2A/MingguL2A`).set(MinDataWaktuL2A);
            document.getElementById(MinNotifIdL2A).innerText = `${MinTimeValueL2A}`;
        };
        MinTampilanWaktuL2A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function MinTampilanWaktuL2A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2A/MingguL2A`).once('value').then(snapshot => {
        const MinKondisi1L2A = snapshot.val();
        if(MinKondisi1L2A){
            document.getElementById('MinTextJam1L2A').innerText = `${MinKondisi1L2A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2A/MingguL2A`).once('value').then(snapshot => {
            const MinKondisi1L2A = snapshot.val();
            if (MinKondisi1L2A) MinCekWaktuL2A(MinKondisi1L2A, 'MinSwitch1L2A', 'MinTimer1L2A');
        });
    }, 1000);
}

function MinCekWaktuL2A(MinDataWaktuL2A, MinSwitchIdL2A, MinTimerIdL2A) {
    const MinCurrentTimeL2A = new Date();
    const MinCurrentDayL2A = MinCurrentTimeL2A.getDay();
    const MinCurrentHourL2A = MinCurrentTimeL2A.toTimeString().slice(0, 5); 

    if (MinCurrentDayL2A === MinDataWaktuL2A.MdayL2A && MinCurrentHourL2A === MinDataWaktuL2A.time) {
        if (!MinDataWaktuL2A.MinStartTimeL2A) {
            MinDataWaktuL2A.MinStartTimeL2A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2A/MingguL2A`).set(MinDataWaktuL2A);
        }
        document.getElementById(MinSwitchIdL2A).checked = true;

        const MinStartTimeL2A = new Date(MinDataWaktuL2A.MinStartTimeL2A);
        const MinDetikLewatL2A = Math.floor((MinCurrentTimeL2A - MinStartTimeL2A) / 1000);
        const MinRemainingDetikL2A = MinDataWaktuL2A.duration * 60 - MinDetikLewatL2A;

        if (MinRemainingDetikL2A > 0) {
            MinStartTimerL2A(MinTimerIdL2A, MinRemainingDetikL2A, MinSwitchIdL2A);
            controlLED("Lateral2","L2A");
        } else {
            MinResetWaktuL2A(MinSwitchIdL2A, MinTimerIdL2A);
        }
    }
}

function MinResetWaktuL2A(MinSwitchIdL2A, MinTimerIdL2A) {
    document.getElementById(MinSwitchIdL2A).checked = false;
    firebase.database().ref(`DataWaktuL2A/MingguL2A`).set(null);
    controlLED("Lateral2","OFF");
}

function MinStartTimerL2A(MinTimerIdL2A, MinInSecL2A, MinSwitchIdL2A) {
    let MinRemainingWakL2A = MinInSecL2A;

    const MinTimerIntervalL2A = setInterval(() => {
        const Menit = Math.floor(MinRemainingWakL2A / 60);
        const Detik = MinRemainingWakL2A % 60;
        document.getElementById(MinTimerIdL2A).innerText = `${Menit}: ${Detik}`;
        
        MinRemainingWakL2A--;

        if(MinRemainingWakL2A < 0){
            clearInterval(MinTimerIntervalL2A);
            MinResetWaktuL2A(MinSwitchIdL2A, MinTimerIdL2A);
            firebase.database().ref(`Timer/TimerEnd`).set(MinRemainingWakL2A);
            document.getElementById('MinTimer1L2A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = MinTampilanWaktuL2A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2A/MingguL2A`).set(null);
    document.getElementById('MinTextJam1L2A').innerText = '--:--';
});
