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
function setHariJumatL1A(JumTimeIdL1A, JumDurasiIdL1A, JumSwitchIdL1A, JumNotifIdL1A, JumTimerIdL1A) {
    const JumTimeValueL1A = document.getElementById(JumTimeIdL1A).value;
    const JumDurasiValueL1A = document.getElementById(JumDurasiIdL1A).value;
    
    if (JumTimeValueL1A && JumDurasiValueL1A ) {
        const JdayL1A = 5;
        const JumDataWaktuL1A = { 
            time: JumTimeValueL1A, 
            duration: JumDurasiValueL1A, 
            JdayL1A: JdayL1A, 
            JumStartTimeL1A: null };
        
        if (JumSwitchIdL1A === 'JumSwitch1L1A') {
            // Simpan data ke Firebase
            firebase.database().ref(`DataWaktuL1A/JumatL1A`).set(JumDataWaktuL1A);
            document.getElementById(JumNotifIdL1A).innerText = `${JumTimeValueL1A}`;
        };
        JumTampilanWaktuL1A();
    } else {
        console.log("Tolong Masukkan waktu dan durasi");
    }
}

function JumTampilanWaktuL1A() {
    // Ambil data dari Firebase
    firebase.database().ref(`DataWaktuL1A/JumatL1A`).once('value').then(snapshot => {
        const JumKondisi1L1A = snapshot.val();
        if(JumKondisi1L1A){
            document.getElementById('JumTextJam1L1A').innerText = `${JumKondisi1L1A.time}`;
        }
    });

    setInterval(() => {
        // Cek kondisi di Firebase setiap detik
        firebase.database().ref(`DataWaktuL1A/JumatL1A`).once('value').then(snapshot => {
            const JumKondisi1L1A = snapshot.val();
            if (JumKondisi1L1A) JumCekWaktuL1A(JumKondisi1L1A, 'JumSwitch1L1A', 'JumTimer1L1A');
        });
    }, 1000);
}

function JumCekWaktuL1A(JumDataWaktuL1A, JumSwitchIdL1A, JumTimerIdL1A) {
    const JumCurrentTimeL1A = new Date();
    const JumCurrentDayL1A = JumCurrentTimeL1A.getDay();
    const JumCurrentHourL1A = JumCurrentTimeL1A.toTimeString().slice(0, 5); 

    if (JumCurrentDayL1A === JumDataWaktuL1A.JdayL1A && JumCurrentHourL1A === JumDataWaktuL1A.time) {
        if (!JumDataWaktuL1A.JumStartTimeL1A) {
            JumDataWaktuL1A.JumStartTimeL1A = new Date().toISOString();
            // Update data di Firebase
            firebase.database().ref(`DataWaktuL1A/JumatL1A`).set(JumDataWaktuL1A);
        }
        document.getElementById(JumSwitchIdL1A).checked = true;

        const JumStartTimeL1A = new Date(JumDataWaktuL1A.JumStartTimeL1A);
        const JumDetikLewatL1A = Math.floor((JumCurrentTimeL1A - JumStartTimeL1A) / 1000);
        const JumRemainingDetikL1A = JumDataWaktuL1A.duration * 60 - JumDetikLewatL1A;

        if (JumRemainingDetikL1A > 0) {
            JumStartTimerL1A(JumTimerIdL1A, JumRemainingDetikL1A, JumSwitchIdL1A);
            controlLED("Lateral1", "L1A");
        } else {
            JumResetWaktuL1A(JumSwitchIdL1A, JumTimerIdL1A);
        }
    }
}

function JumResetWaktuL1A(JumSwitchIdL1A, JumTimerIdL1A) {
    document.getElementById(JumSwitchIdL1A).checked = false;
    firebase.database().ref(`DataWaktuL1A/JumatL1A`).set(null);
    controlLED("Lateral1", "OFF");
}

function JumStartTimerL1A(JumTimerIdL1A, JumInSecL1A, JumSwitchIdL1A) {
    let JumRemainingWakL1A = JumInSecL1A;

    const JumTimerIntervalL1A = setInterval(() => {
        const Menit = Math.floor(JumRemainingWakL1A / 60);
        const Detik = JumRemainingWakL1A % 60;
        document.getElementById(JumTimerIdL1A).innerText = `${Menit}: ${Detik}`;
        
        JumRemainingWakL1A--;

        if(JumRemainingWakL1A < 0){
            clearInterval(JumTimerIntervalL1A);
            JumResetWaktuL1A(JumSwitchIdL1A, JumTimerIdL1A);
            firebase.database().ref(`Timer/TimerEnd`).set(JumRemainingWakL1A);
            document.getElementById('JumTimer1L1A').innerText = '--:--';
        }
    }, 1000);
}

window.onload = JumTampilanWaktuL1A;

document.getElementById('ResetWaktu1').addEventListener('click',() => {
    firebase.database().ref(`DataWaktuL1A/JumatL1A`).set(null);
    document.getElementById('JumTextJam1L1A').innerText = '--:--';
});
