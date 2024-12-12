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
function setHariKamisL2A(KamTimeIdL2A, KamDurasiIdL2A, KamSwitchIdL2A, KamNotifIdL2A, KamTimerIdL2A) {
    const KamTimeValueL2A = document.getElementById(KamTimeIdL2A).value;
    const KamDurasiValueL2A = document.getElementById(KamDurasiIdL2A).value;
    
    if (KamTimeValueL2A && KamDurasiValueL2A ) {
        const KdayL2A = 4;
        const KamDataWaktuL2A = { 
            time: KamTimeValueL2A, 
            duration: KamDurasiValueL2A, 
            KdayL2A: KdayL2A, 
            KamStartTimeL2A: null };
        
        if (KamSwitchIdL2A === 'KamSwitch1L2A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL2A/KamisL2A`).set(KamDataWaktuL2A);
            document.getElementById(KamNotifIdL2A).innerText = `${KamTimeValueL2A}`;
        };
        KamTampilanWaktuL2A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function KamTampilanWaktuL2A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL2A/KamisL2A`).once('value').then(snapshot => {
        const KamKondisi1L2A = snapshot.val();
        if(KamKondisi1L2A){
            document.getElementById('KamTextJam1L2A').innerText = `${KamKondisi1L2A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL2A/KamisL2A`).once('value').then(snapshot => {
            const KamKondisi1L2A = snapshot.val();
            if (KamKondisi1L2A) KamCekWaktuL2A(KamKondisi1L2A, 'KamSwitch1L2A', 'KamTimer1L2A');
        });
    }, 1000);
}

function KamCekWaktuL2A(KamDataWaktuL2A, KamSwitchIdL2A, KamTimerIdL2A) {
    const KamCurrentTimeL2A = new Date();
    const KamCurrentDayL2A = KamCurrentTimeL2A.getDay();
    const KamCurrentHourL2A = KamCurrentTimeL2A.toTimeString().slice(0, 5); 

    if (KamCurrentDayL2A === KamDataWaktuL2A.KdayL2A && KamCurrentHourL2A === KamDataWaktuL2A.time) {
        if (!KamDataWaktuL2A.KamStartTimeL2A) {
            KamDataWaktuL2A.KamStartTimeL2A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL2A/KamisL2A`).set(KamDataWaktuL2A);
        }
        document.getElementById(KamSwitchIdL2A).checked = true;

        const KamStartTimeL2A = new Date(KamDataWaktuL2A.KamStartTimeL2A);
        const KamDetikLewatL2A = Math.floor((KamCurrentTimeL2A - KamStartTimeL2A) / 1000);
        const KamRemainingDetikL2A = KamDataWaktuL2A.duration * 60 - KamDetikLewatL2A;

        if (KamRemainingDetikL2A > 0) {
            KamStartTimerL2A(KamTimerIdL2A, KamRemainingDetikL2A, KamSwitchIdL2A);
            controlLED("Lateral2","L2A");
        } else {
            KamResetWaktuL2A(KamSwitchIdL2A, KamTimerIdL2A);
        }
    }
}

function KamResetWaktuL2A(KamSwitchIdL2A, KamTimerIdL2A) {
    document.getElementById(KamSwitchIdL2A).checked = false;
    firebase.database().ref(`DataWaktuL2A/KamisL2A`).set(null);
    controlLED("Lateral2","OFF");
}

function KamStartTimerL2A(KamTimerIdL2A, KamInSecL2A, KamSwitchIdL2A) {
    let KamRemainingWakL2A = KamInSecL2A;

    const KamTimerIntervalL2A = setInterval(() => {
        const Menit = Math.floor(KamRemainingWakL2A / 60);
        const Detik = KamRemainingWakL2A % 60;
        document.getElementById(KamTimerIdL2A).innerText = `${Menit}: ${Detik}`;
        
        KamRemainingWakL2A--;

        if(KamRemainingWakL2A < 0){
            clearInterval(KamTimerIntervalL2A);
            KamResetWaktuL2A(KamSwitchIdL2A, KamTimerIdL2A);
            firebase.database().ref(`Timer/TimerEnd`).set(KamRemainingWakL2A);
            document.getElementById('KamTimer1L2A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = KamTampilanWaktuL2A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL2A/KamisL2A`).set(null);
    document.getElementById('KamTextJam1L2A').innerText = '--:--';
});
