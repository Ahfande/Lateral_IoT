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
    messagingSelderId: "809053328128",
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
function setHariSelasaL1A(SelTimeIdL1A, SelDurasiIdL1A, SelSwitchIdL1A, SelNotifIdL1A, SelTimerIdL1A) {
    const SelTimeValueL1A = document.getElementById(SelTimeIdL1A).value;
    const SelDurasiValueL1A = document.getElementById(SelDurasiIdL1A).value;
    
    if (SelTimeValueL1A && SelDurasiValueL1A ) {
        const SdayL1A = 2;
        const SelDataWaktuL1A = { 
            time: SelTimeValueL1A, 
            duration: SelDurasiValueL1A, 
            SdayL1A: SdayL1A, 
            SelStartTimeL1A: null };
        
        if (SelSwitchIdL1A === 'SelSwitch1L1A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1A/SelasaL1A`).set(SelDataWaktuL1A);
            document.getElementById(SelNotifIdL1A).innerText = `${SelTimeValueL1A}`;
        };
        SelTampilanWaktuL1A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SelTampilanWaktuL1A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1A/SelasaL1A`).once('value').then(snapshot => {
        const SelKondisi1L1A = snapshot.val();
        if(SelKondisi1L1A){
            document.getElementById('SelTextJam1L1A').innerText = `${SelKondisi1L1A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1A/SelasaL1A`).once('value').then(snapshot => {
            const SelKondisi1L1A = snapshot.val();
            if (SelKondisi1L1A) SelCekWaktuL1A(SelKondisi1L1A, 'SelSwitch1L1A', 'SelTimer1L1A');
        });
    }, 1000);
}

function SelCekWaktuL1A(SelDataWaktuL1A, SelSwitchIdL1A, SelTimerIdL1A) {
    const SelCurrentTimeL1A = new Date();
    const SelCurrentDayL1A = SelCurrentTimeL1A.getDay();
    const SelCurrentHourL1A = SelCurrentTimeL1A.toTimeString().slice(0, 5); 

    if (SelCurrentDayL1A === SelDataWaktuL1A.SdayL1A && SelCurrentHourL1A === SelDataWaktuL1A.time) {
        if (!SelDataWaktuL1A.SelStartTimeL1A) {
            SelDataWaktuL1A.SelStartTimeL1A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1A/SelasaL1A`).set(SelDataWaktuL1A);
        }
        document.getElementById(SelSwitchIdL1A).checked = true;

        const SelStartTimeL1A = new Date(SelDataWaktuL1A.SelStartTimeL1A);
        const SelDetikLewatL1A = Math.floor((SelCurrentTimeL1A - SelStartTimeL1A) / 1000);
        const SelRemainingDetikL1A = SelDataWaktuL1A.duration * 60 - SelDetikLewatL1A;

        if (SelRemainingDetikL1A > 0) {
            SelStartTimerL1A(SelTimerIdL1A, SelRemainingDetikL1A, SelSwitchIdL1A);
            controlLED("Lateral1", "L1A");
        } else {
            SelResetWaktuL1A(SelSwitchIdL1A, SelTimerIdL1A);
        }
    }
}

function SelResetWaktuL1A(SelSwitchIdL1A, SelTimerIdL1A) {
    document.getElementById(SelSwitchIdL1A).checked = false;
    firebase.database().ref(`DataWaktuL1A/SelasaL1A`).set(null);
    controlLED("Lateral1", "OFF");
}

function SelStartTimerL1A(SelTimerIdL1A, SelInSecL1A, SelSwitchIdL1A) {
    let SelRemainingWakL1A = SelInSecL1A;

    const SelTimerIntervalL1A = setInterval(() => {
        const Menit = Math.floor(SelRemainingWakL1A / 60);
        const Detik = SelRemainingWakL1A % 60;
        document.getElementById(SelTimerIdL1A).innerText = `${Menit}: ${Detik}`;
        
        SelRemainingWakL1A--;

        if(SelRemainingWakL1A < 0){
            clearInterval(SelTimerIntervalL1A);
            SelResetWaktuL1A(SelSwitchIdL1A, SelTimerIdL1A);
            firebase.database().ref(`Timer/TimerEnd`).set(SelRemainingWakL1A);
            document.getElementById('SelTimer1L1A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SelTampilanWaktuL1A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1A/SelasaL1A`).set(null);
    document.getElementById('SelTextJam1L1A').innerText = '--:--';
});
