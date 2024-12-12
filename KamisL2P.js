document.getElementById('back').addEventListener('click', () =>{
    window.location.href = 'JadwalL2P.html';
});

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
function setHariKamisL2P(KamTimeIdL2P, KamDurasiIdL2P, KamSwitchIdL2P, KamNotifIdL2P, KamTimerIdL2P) {
    const KamTimeValueL2P = document.getElementById(KamTimeIdL2P).value;
    const KamDurasiValueL2P = document.getElementById(KamDurasiIdL2P).value;
    
    if (KamTimeValueL2P && KamDurasiValueL2P ) {
        const KdayL2P = 4;
        const KamDataWaktuL2P = { 
            time: KamTimeValueL2P, 
            duration: KamDurasiValueL2P, 
            KdayL2P: KdayL2P, 
            KamStartTimeL2P: null };
        
        if (KamSwitchIdL2P === 'KamSwitch1L2P') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2P/KamisL2P`).set(KamDataWaktuL2P);
            document.getElementById(KamNotifIdL2P).innerText = `${KamTimeValueL2P}`;
        };
        KamTampilanWaktuL2P();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function KamTampilanWaktuL2P() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2P/KamisL2P`).once('value').then(snapshot => {
        const KamKondisi1L2P = snapshot.val();
        if(KamKondisi1L2P){
            document.getElementById('KamTextJam1L2P').innerText = `${KamKondisi1L2P.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2P/KamisL2P`).once('value').then(snapshot => {
            const KamKondisi1L2P = snapshot.val();
            if (KamKondisi1L2P) KamCekWaktuL2P(KamKondisi1L2P, 'KamSwitch1L2P', 'KamTimer1L2P');
        });
    }, 1000);
}

function KamCekWaktuL2P(KamDataWaktuL2P, KamSwitchIdL2P, KamTimerIdL2P) {
    const KamCurrentTimeL2P = new Date();
    const KamCurrentDayL2P = KamCurrentTimeL2P.getDay();
    const KamCurrentHourL2P = KamCurrentTimeL2P.toTimeString().slice(0, 5); 

    if (KamCurrentDayL2P === KamDataWaktuL2P.KdayL2P && KamCurrentHourL2P === KamDataWaktuL2P.time) {
        if (!KamDataWaktuL2P.KamStartTimeL2P) {
            KamDataWaktuL2P.KamStartTimeL2P = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2P/KamisL2P`).set(KamDataWaktuL2P);
        }
        document.getElementById(KamSwitchIdL2P).checked = true;

        const KamStartTimeL2P = new Date(KamDataWaktuL2P.KamStartTimeL2P);
        const KamDetikLewatL2P = Math.floor((KamCurrentTimeL2P - KamStartTimeL2P) / 1000);
        const KamRemainingDetikL2P = KamDataWaktuL2P.duration * 60 - KamDetikLewatL2P;

        if (KamRemainingDetikL2P > 0) {
            KamStartTimerL2P(KamTimerIdL2P, KamRemainingDetikL2P, KamSwitchIdL2P);
            controlLED("Lateral2","L2P");
        } else {
            KamResetWaktuL2P(KamSwitchIdL2P, KamTimerIdL2P);
        }
    }
}

function KamResetWaktuL2P(KamSwitchIdL2P, KamTimerIdL2P) {
    document.getElementById(KamSwitchIdL2P).checked = false;
    firebase.database().ref(`DataWaktuL2P/KamisL2P`).set(null);
    controlLED("Lateral2","OFF");
}

function KamStartTimerL2P(KamTimerIdL2P, KamInSecL2P, KamSwitchIdL2P) {
    let KamRemainingWakL2P = KamInSecL2P;

    const KamTimerIntervalL2P = setInterval(() => {
        const Menit = Math.floor(KamRemainingWakL2P / 60);
        const Detik = KamRemainingWakL2P % 60;
        document.getElementById(KamTimerIdL2P).innerText = `${Menit}: ${Detik}`;
        
        KamRemainingWakL2P--;

        if(KamRemainingWakL2P < 0){
            clearInterval(KamTimerIntervalL2P);
            KamResetWaktuL2P(KamSwitchIdL2P, KamTimerIdL2P);
            firebase.database().ref(`Timer/TimerEnd`).set(KamRemainingWakL2P);
            document.getElementById('KamTimer1L2P').innerText = '--:--';
        }
    }, 1000);
}

window.onload = KamTampilanWaktuL2P;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2P/KamisL2P`).set(null);
    document.getElementById('KamTextJam1L2P').innerText = '--:--';
});
