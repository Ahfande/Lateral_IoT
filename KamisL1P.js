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
function setHariKamisL1P(KamTimeIdL1P, KamDurasiIdL1P, KamSwitchIdL1P, KamNotifIdL1P, KamTimerIdL1P) {
    const KamTimeValueL1P = document.getElementById(KamTimeIdL1P).value;
    const KamDurasiValueL1P = document.getElementById(KamDurasiIdL1P).value;
    
    if (KamTimeValueL1P && KamDurasiValueL1P ) {
        const KdayL1P = 4;
        const KamDataWaktuL1P = { 
            time: KamTimeValueL1P, 
            duration: KamDurasiValueL1P, 
            KdayL1P: KdayL1P, 
            KamStartTimeL1P: null };
        
        if (KamSwitchIdL1P === 'KamSwitch1L1P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1P/KamisL1P`).set(KamDataWaktuL1P);
            document.getElementById(KamNotifIdL1P).innerText = `${KamTimeValueL1P}`;
        };
        KamTampilanWaktuL1P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function KamTampilanWaktuL1P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1P/KamisL1P`).once('value').then(snapshot => {
        const KamKondisi1L1P = snapshot.val();
        if(KamKondisi1L1P){
            document.getElementById('KamTextJam1L1P').innerText = `${KamKondisi1L1P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1P/KamisL1P`).once('value').then(snapshot => {
            const KamKondisi1L1P = snapshot.val();
            if (KamKondisi1L1P) KamCekWaktuL1P(KamKondisi1L1P, 'KamSwitch1L1P', 'KamTimer1L1P');
        });
    }, 1000);
}

function KamCekWaktuL1P(KamDataWaktuL1P, KamSwitchIdL1P, KamTimerIdL1P) {
    const KamCurrentTimeL1P = new Date();
    const KamCurrentDayL1P = KamCurrentTimeL1P.getDay();
    const KamCurrentHourL1P = KamCurrentTimeL1P.toTimeString().slice(0, 5); 

    if (KamCurrentDayL1P === KamDataWaktuL1P.KdayL1P && KamCurrentHourL1P === KamDataWaktuL1P.time) {
        if (!KamDataWaktuL1P.KamStartTimeL1P) {
            KamDataWaktuL1P.KamStartTimeL1P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1P/KamisL1P`).set(KamDataWaktuL1P);
        }
        document.getElementById(KamSwitchIdL1P).checked = true;

        const KamStartTimeL1P = new Date(KamDataWaktuL1P.KamStartTimeL1P);
        const KamDetikLewatL1P = Math.floor((KamCurrentTimeL1P - KamStartTimeL1P) / 1000);
        const KamRemainingDetikL1P = KamDataWaktuL1P.duration * 60 - KamDetikLewatL1P;

        if (KamRemainingDetikL1P > 0) {
            KamStartTimerL1P(KamTimerIdL1P, KamRemainingDetikL1P, KamSwitchIdL1P);
            controlLED("Lateral1","L1P");
        } else {
            KamResetWaktuL1P(KamSwitchIdL1P, KamTimerIdL1P);
        }
    }
}

function KamResetWaktuL1P(KamSwitchIdL1P, KamTimerIdL1P) {
    document.getElementById(KamSwitchIdL1P).checked = false;
    firebase.database().ref(`DataWaktuL1P/KamisL1P`).set(null);
    controlLED("Lateral1","OFF");
}

function KamStartTimerL1P(KamTimerIdL1P, KamInSecL1P, KamSwitchIdL1P) {
    let KamRemainingWakL1P = KamInSecL1P;

    const KamTimerIntervalL1P = setInterval(() => {
        const Menit = Math.floor(KamRemainingWakL1P / 60);
        const Detik = KamRemainingWakL1P % 60;
        document.getElementById(KamTimerIdL1P).innerText = `${Menit}: ${Detik}`;
        
        KamRemainingWakL1P--;

        if(KamRemainingWakL1P < 0){
            clearInterval(KamTimerIntervalL1P);
            KamResetWaktuL1P(KamSwitchIdL1P, KamTimerIdL1P);
            firebase.database().ref(`Timer/TimerEnd`).set(KamRemainingWakL1P);
            document.getElementById('KamTimer1L1P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = KamTampilanWaktuL1P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1P/KamisL1P`).set(null);
    document.getElementById('KamTextJam1L1P').innerText = '--:--';
});
