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
    messagingSelderId: "809053328128",
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
function setHariSelasaL2P(SelTimeIdL2P, SelDurasiIdL2P, SelSwitchIdL2P, SelNotifIdL2P, SelTimerIdL2P) {
    const SelTimeValueL2P = document.getElementById(SelTimeIdL2P).value;
    const SelDurasiValueL2P = document.getElementById(SelDurasiIdL2P).value;
    
    if (SelTimeValueL2P && SelDurasiValueL2P ) {
        const SdayL2P = 2;
        const SelDataWaktuL2P = { 
            time: SelTimeValueL2P, 
            duration: SelDurasiValueL2P, 
            SdayL2P: SdayL2P, 
            SelStartTimeL2P: null };
        
        if (SelSwitchIdL2P === 'SelSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/SelasaL2P`).set(SelDataWaktuL2P);
            document.getElementById(SelNotifIdL2P).innerText = `${SelTimeValueL2P}`;
        };
        SelTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SelTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/SelasaL2P`).once('value').then(snapshot => {
        const SelKondisi1L2P = snapshot.val();
        if(SelKondisi1L2P){
            document.getElementById('SelTextJam1L2P').innerText = `${SelKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/SelasaL2P`).once('value').then(snapshot => {
            const SelKondisi1L2P = snapshot.val();
            if (SelKondisi1L2P) SelCekWaktuL2P(SelKondisi1L2P, 'SelSwitch1L2P', 'SelTimer1L2P');
        });
    }, 1000);
}

function SelCekWaktuL2P(SelDataWaktuL2P, SelSwitchIdL2P, SelTimerIdL2P) {
    const SelCurrentTimeL2P = new Date();
    const SelCurrentDayL2P = SelCurrentTimeL2P.getDay();
    const SelCurrentHourL2P = SelCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (SelCurrentDayL2P === SelDataWaktuL2P.SdayL2P && SelCurrentHourL2P === SelDataWaktuL2P.time) {
        if (!SelDataWaktuL2P.SelStartTimeL2P) {
            SelDataWaktuL2P.SelStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/SelasaL2P`).set(SelDataWaktuL2P);
        }
        document.getElementById(SelSwitchIdL2P).checked = true;

        const SelStartTimeL2P = new Date(SelDataWaktuL2P.SelStartTimeL2P);
        const SelDetikLewatL2P = Math.floor((SelCurrentTimeL2P - SelStartTimeL2P) / 1000);
        const SelRemainingDetikL2P = SelDataWaktuL2P.duration * 60 - SelDetikLewatL2P;

        if (SelRemainingDetikL2P > 0) {
            SelStartTimerL2P(SelTimerIdL2P, SelRemainingDetikL2P, SelSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            SelResetWaktuL2P(SelSwitchIdL2P, SelTimerIdL2P);
        }
    }
}

function SelResetWaktuL2P(SelSwitchIdL2P, SelTimerIdL2P) {
    document.getElementById(SelSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/SelasaL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function SelStartTimerL2P(SelTimerIdL2P, SelInSecL2P, SelSwitchIdL2P) {
    let SelRemainingWakL2P = SelInSecL2P;

    const SelTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(SelRemainingWakL2P / 60);
        const Detik = SelRemainingWakL2P % 60;
        document.getElementById(SelTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        SelRemainingWakL2P--;

        if(SelRemainingWakL2P < 0){
            clearInterval(SelTimerIntervalL2P);
            SelResetWaktuL2P(SelSwitchIdL2P, SelTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(SelRemainingWakL2P);
            document.getElementById('SelTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SelTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/SelasaL2P`).set(null);
    document.getElementById('SelTextJam1L2P').innerText = '--:--';
});
