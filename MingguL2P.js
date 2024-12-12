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
function setHariMingguL2P(MinTimeIdL2P, MinDurasiIdL2P, MinSwitchIdL2P, MinNotifIdL2P, MinTimerIdL2P) {
    const MinTimeValueL2P = document.getElementById(MinTimeIdL2P).value;
    const MinDurasiValueL2P = document.getElementById(MinDurasiIdL2P).value;
    
    if (MinTimeValueL2P && MinDurasiValueL2P ) {
        const MdayL2P = 0;
        const MinDataWaktuL2P = { 
            time: MinTimeValueL2P, 
            duration: MinDurasiValueL2P, 
            MdayL2P: MdayL2P, 
            MinStartTimeL2P: null };
        
        if (MinSwitchIdL2P === 'MinSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/MingguL2P`).set(MinDataWaktuL2P);
            document.getElementById(MinNotifIdL2P).innerText = `${MinTimeValueL2P}`;
        };
        MinTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function MinTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/MingguL2P`).once('value').then(snapshot => {
        const MinKondisi1L2P = snapshot.val();
        if(MinKondisi1L2P){
            document.getElementById('MinTextJam1L2P').innerText = `${MinKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/MingguL2P`).once('value').then(snapshot => {
            const MinKondisi1L2P = snapshot.val();
            if (MinKondisi1L2P) MinCekWaktuL2P(MinKondisi1L2P, 'MinSwitch1L2P', 'MinTimer1L2P');
        });
    }, 1000);
}

function MinCekWaktuL2P(MinDataWaktuL2P, MinSwitchIdL2P, MinTimerIdL2P) {
    const MinCurrentTimeL2P = new Date();
    const MinCurrentDayL2P = MinCurrentTimeL2P.getDay();
    const MinCurrentHourL2P = MinCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (MinCurrentDayL2P === MinDataWaktuL2P.MdayL2P && MinCurrentHourL2P === MinDataWaktuL2P.time) {
        if (!MinDataWaktuL2P.MinStartTimeL2P) {
            MinDataWaktuL2P.MinStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/MingguL2P`).set(MinDataWaktuL2P);
        }
        document.getElementById(MinSwitchIdL2P).checked = true;

        const MinStartTimeL2P = new Date(MinDataWaktuL2P.MinStartTimeL2P);
        const MinDetikLewatL2P = Math.floor((MinCurrentTimeL2P - MinStartTimeL2P) / 1000);
        const MinRemainingDetikL2P = MinDataWaktuL2P.duration * 60 - MinDetikLewatL2P;

        if (MinRemainingDetikL2P > 0) {
            MinStartTimerL2P(MinTimerIdL2P, MinRemainingDetikL2P, MinSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            MinResetWaktuL2P(MinSwitchIdL2P, MinTimerIdL2P);
        }
    }
}

function MinResetWaktuL2P(MinSwitchIdL2P, MinTimerIdL2P) {
    document.getElementById(MinSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/MingguL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function MinStartTimerL2P(MinTimerIdL2P, MinInSecL2P, MinSwitchIdL2P) {
    let MinRemainingWakL2P = MinInSecL2P;

    const MinTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(MinRemainingWakL2P / 60);
        const Detik = MinRemainingWakL2P % 60;
        document.getElementById(MinTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        MinRemainingWakL2P--;

        if(MinRemainingWakL2P < 0){
            clearInterval(MinTimerIntervalL2P);
            MinResetWaktuL2P(MinSwitchIdL2P, MinTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(MinRemainingWakL2P);
            document.getElementById('MinTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = MinTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/MingguL2P`).set(null);
    document.getElementById('MinTextJam1L2P').innerText = '--:--';
});
