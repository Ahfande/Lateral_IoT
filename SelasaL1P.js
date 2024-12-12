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
    messagingSelderId: "809053328128",
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
function setHariSelasaL1P(SelTimeIdL1P, SelDurasiIdL1P, SelSwitchIdL1P, SelNotifIdL1P, SelTimerIdL1P) {
    const SelTimeValueL1P = document.getElementById(SelTimeIdL1P).value;
    const SelDurasiValueL1P = document.getElementById(SelDurasiIdL1P).value;
    
    if (SelTimeValueL1P && SelDurasiValueL1P ) {
        const SdayL1P = 2;
        const SelDataWaktuL1P = { 
            time: SelTimeValueL1P, 
            duration: SelDurasiValueL1P, 
            SdayL1P: SdayL1P, 
            SelStartTimeL1P: null };
        
        if (SelSwitchIdL1P === 'SelSwitch1L1P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1P/SelasaL1P`).set(SelDataWaktuL1P);
            document.getElementById(SelNotifIdL1P).innerText = `${SelTimeValueL1P}`;
        };
        SelTampilanWaktuL1P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function SelTampilanWaktuL1P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1P/SelasaL1P`).once('value').then(snapshot => {
        const SelKondisi1L1P = snapshot.val();
        if(SelKondisi1L1P){
            document.getElementById('SelTextJam1L1P').innerText = `${SelKondisi1L1P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1P/SelasaL1P`).once('value').then(snapshot => {
            const SelKondisi1L1P = snapshot.val();
            if (SelKondisi1L1P) SelCekWaktuL1P(SelKondisi1L1P, 'SelSwitch1L1P', 'SelTimer1L1P');
        });
    }, 1000);
}

function SelCekWaktuL1P(SelDataWaktuL1P, SelSwitchIdL1P, SelTimerIdL1P) {
    const SelCurrentTimeL1P = new Date();
    const SelCurrentDayL1P = SelCurrentTimeL1P.getDay();
    const SelCurrentHourL1P = SelCurrentTimeL1P.toTimeString().slice(0, 5); 

    if (SelCurrentDayL1P === SelDataWaktuL1P.SdayL1P && SelCurrentHourL1P === SelDataWaktuL1P.time) {
        if (!SelDataWaktuL1P.SelStartTimeL1P) {
            SelDataWaktuL1P.SelStartTimeL1P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1P/SelasaL1P`).set(SelDataWaktuL1P);
        }
        document.getElementById(SelSwitchIdL1P).checked = true;

        const SelStartTimeL1P = new Date(SelDataWaktuL1P.SelStartTimeL1P);
        const SelDetikLewatL1P = Math.floor((SelCurrentTimeL1P - SelStartTimeL1P) / 1000);
        const SelRemainingDetikL1P = SelDataWaktuL1P.duration * 60 - SelDetikLewatL1P;

        if (SelRemainingDetikL1P > 0) {
            SelStartTimerL1P(SelTimerIdL1P, SelRemainingDetikL1P, SelSwitchIdL1P);
            controlLED("Lateral1","L1P");
        } else {
            SelResetWaktuL1P(SelSwitchIdL1P, SelTimerIdL1P);
        }
    }
}

function SelResetWaktuL1P(SelSwitchIdL1P, SelTimerIdL1P) {
    document.getElementById(SelSwitchIdL1P).checked = false;
    firebase.database().ref(`DataWaktuL1P/SelasaL1P`).set(null);
    controlLED("Lateral1","OFF");
}

function SelStartTimerL1P(SelTimerIdL1P, SelInSecL1P, SelSwitchIdL1P) {
    let SelRemainingWakL1P = SelInSecL1P;

    const SelTimerIntervalL1P = setInterval(() => {
        const Menit = Math.floor(SelRemainingWakL1P / 60);
        const Detik = SelRemainingWakL1P % 60;
        document.getElementById(SelTimerIdL1P).innerText = `${Menit}: ${Detik}`;
        
        SelRemainingWakL1P--;

        if(SelRemainingWakL1P < 0){
            clearInterval(SelTimerIntervalL1P);
            SelResetWaktuL1P(SelSwitchIdL1P, SelTimerIdL1P);
            firebase.database().ref(`Timer/TimerEnd`).set(SelRemainingWakL1P);
            document.getElementById('SelTimer1L1P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = SelTampilanWaktuL1P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1P/SelasaL1P`).set(null);
    document.getElementById('SelTextJam1L1P').innerText = '--:--';
});
