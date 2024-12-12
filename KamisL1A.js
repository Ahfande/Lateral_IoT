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
function setHariKamisL1A(KamTimeIdL1A, KamDurasiIdL1A, KamSwitchIdL1A, KamNotifIdL1A, KamTimerIdL1A) {
    const KamTimeValueL1A = document.getElementById(KamTimeIdL1A).value;
    const KamDurasiValueL1A = document.getElementById(KamDurasiIdL1A).value;
    
    if (KamTimeValueL1A && KamDurasiValueL1A ) {
        const KdayL1A = 4;
        const KamDataWaktuL1A = { 
            time: KamTimeValueL1A, 
            duration: KamDurasiValueL1A, 
            KdayL1A: KdayL1A, 
            KamStartTimeL1A: null };
        
        if (KamSwitchIdL1A === 'KamSwitch1L1A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1A/KamisL1A`).set(KamDataWaktuL1A);
            document.getElementById(KamNotifIdL1A).innerText = `${KamTimeValueL1A}`;
        };
        KamTampilanWaktuL1A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function KamTampilanWaktuL1A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1A/KamisL1A`).once('value').then(snapshot => {
        const KamKondisi1L1A = snapshot.val();
        if(KamKondisi1L1A){
            document.getElementById('KamTextJam1L1A').innerText = `${KamKondisi1L1A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1A/KamisL1A`).once('value').then(snapshot => {
            const KamKondisi1L1A = snapshot.val();
            if (KamKondisi1L1A) KamCekWaktuL1A(KamKondisi1L1A, 'KamSwitch1L1A', 'KamTimer1L1A');
        });
    }, 1000);
}

function KamCekWaktuL1A(KamDataWaktuL1A, KamSwitchIdL1A, KamTimerIdL1A) {
    const KamCurrentTimeL1A = new Date();
    const KamCurrentDayL1A = KamCurrentTimeL1A.getDay();
    const KamCurrentHourL1A = KamCurrentTimeL1A.toTimeString().slice(0, 5); 

    if (KamCurrentDayL1A === KamDataWaktuL1A.KdayL1A && KamCurrentHourL1A === KamDataWaktuL1A.time) {
        if (!KamDataWaktuL1A.KamStartTimeL1A) {
            KamDataWaktuL1A.KamStartTimeL1A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1A/KamisL1A`).set(KamDataWaktuL1A);
        }
        document.getElementById(KamSwitchIdL1A).checked = true;

        const KamStartTimeL1A = new Date(KamDataWaktuL1A.KamStartTimeL1A);
        const KamDetikLewatL1A = Math.floor((KamCurrentTimeL1A - KamStartTimeL1A) / 1000);
        const KamRemainingDetikL1A = KamDataWaktuL1A.duration * 60 - KamDetikLewatL1A;

        if (KamRemainingDetikL1A > 0) {
            KamStartTimerL1A(KamTimerIdL1A, KamRemainingDetikL1A, KamSwitchIdL1A);
            controlLED("Lateral1", "L1A");
        } else {
            KamResetWaktuL1A(KamSwitchIdL1A, KamTimerIdL1A);
        }
    }
}

function KamResetWaktuL1A(KamSwitchIdL1A, KamTimerIdL1A) {
    document.getElementById(KamSwitchIdL1A).checked = false;
    firebase.database().ref(`DataWaktuL1A/KamisL1A`).set(null);
    controlLED("Lateral1", "OFF");
}

function KamStartTimerL1A(KamTimerIdL1A, KamInSecL1A, KamSwitchIdL1A) {
    let KamRemainingWakL1A = KamInSecL1A;

    const KamTimerIntervalL1A = setInterval(() => {
        const Menit = Math.floor(KamRemainingWakL1A / 60);
        const Detik = KamRemainingWakL1A % 60;
        document.getElementById(KamTimerIdL1A).innerText = `${Menit}: ${Detik}`;
        
        KamRemainingWakL1A--;

        if(KamRemainingWakL1A < 0){
            clearInterval(KamTimerIntervalL1A);
            KamResetWaktuL1A(KamSwitchIdL1A, KamTimerIdL1A);
            firebase.database().ref(`Timer/TimerEnd`).set(KamRemainingWakL1A);
            document.getElementById('KamTimer1L1A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = KamTampilanWaktuL1A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1A/KamisL1A`).set(null);
    document.getElementById('KamTextJam1L1A').innerText = '--:--';
});
