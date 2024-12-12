function controlLED(lateral, status) {
    firebase.database().ref(`/${lateral}/status`).set(status)
    .then(() => {
        console.log(`${lateral} set to ${status}`);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Cek Waktu L1A
function Lateral1A(){
    // Hari dan jam
    const currentTime = new Date().toTimeString().slice(0, 5);
    const currentDay = new Date().getDay();
    
    // Senin
    firebase.database().ref(`DataWaktuL1A/SeninL1A`).once('value').then(snapshot => {
        const SenKondisi1L1A = snapshot.val();
    if(SenKondisi1L1A && currentDay === SenKondisi1L1A.SndayL1A && currentTime === SenKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Selasa
    firebase.database().ref(`DataWaktuL1A/SelasaL1A`).once('value').then(snapshot => {
        const SelKondisi1L1A = snapshot.val();
    if(SelKondisi1L1A && currentDay === SelKondisi1L1A.SdayL1A && currentTime === SelKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Rabu
    firebase.database().ref(`DataWaktuL1A/RabuL1A`).once('value').then(snapshot => {
        const RabKondisi1L1A = snapshot.val();
    if(RabKondisi1L1A && currentDay === RabKondisi1L1A.RdayL1A && currentTime === RabKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Kamis
    firebase.database().ref(`DataWaktuL1A/KamisL1A`).once('value').then(snapshot => {
        const KamKondisi1L1A = snapshot.val();
    if(KamKondisi1L1A && currentDay === KamKondisi1L1A.KdayL1A && currentTime === KamKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Jumat
    firebase.database().ref(`DataWaktuL1A/JumatL1A`).once('value').then(snapshot => {
        const JumKondisi1L1A = snapshot.val();
    if(JumKondisi1L1A && currentDay === JumKondisi1L1A.JdayL1A && currentTime === JumKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Sabtu
    firebase.database().ref(`DataWaktuL1A/SabtuL1A`).once('value').then(snapshot => {
        const SabKondisi1L1A = snapshot.val();
    if(SabKondisi1L1A && currentDay === SabKondisi1L1A.SbdayL1A && currentTime === SabKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Minggu
    firebase.database().ref(`DataWaktuL1A/MingguL1A`).once('value').then(snapshot => {
        const MinKondisi1L1A = snapshot.val();
    if(MinKondisi1L1A && currentDay === MinKondisi1L1A.MdayL1A && currentTime === MinKondisi1L1A.time){
        controlLED("Lateral1","L1A");
    }else{
        controlLED("Lateral1","OFF");
    }
    })
}

// Cek Waktu L1P
function Lateral1P(){
    // Hari dan jam
    const currentTime = new Date().toTimeString().slice(0, 5);
    const currentDay = new Date().getDay();
    
    // Senin
    firebase.database().ref(`DataWaktuL1P/SeninL1P`).once('value').then(snapshot => {
        const SenKondisi1L1P = snapshot.val();
    if(SenKondisi1L1P && currentDay === SenKondisi1L1P.SndayL1P && currentTime === SenKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Selasa
    firebase.database().ref(`DataWaktuL1P/SelasaL1P`).once('value').then(snapshot => {
        const SelKondisi1L1P = snapshot.val();
    if(SelKondisi1L1P && currentDay === SelKondisi1L1P.SdayL1P && currentTime === SelKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Rabu
    firebase.database().ref(`DataWaktuL1P/RabuL1P`).once('value').then(snapshot => {
        const RabKondisi1L1P = snapshot.val();
    if(RabKondisi1L1P && currentDay === RabKondisi1L1P.RdayL1P && currentTime === RabKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Kamis
    firebase.database().ref(`DataWaktuL1P/KamisL1P`).once('value').then(snapshot => {
        const KamKondisi1L1P = snapshot.val();
    if(KamKondisi1L1P && currentDay === KamKondisi1L1P.KdayL1P && currentTime === KamKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Jumat
    firebase.database().ref(`DataWaktuL1P/JumatL1P`).once('value').then(snapshot => {
        const JumKondisi1L1P = snapshot.val();
    if(JumKondisi1L1P && currentDay === JumKondisi1L1P.JdayL1P && currentTime === JumKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Sabtu
    firebase.database().ref(`DataWaktuL1P/SabtuL1P`).once('value').then(snapshot => {
        const SabKondisi1L1P = snapshot.val();
    if(SabKondisi1L1P && currentDay === SabKondisi1L1P.SbdayL1P && currentTime === SabKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })

    // Minggu
    firebase.database().ref(`DataWaktuL1P/MingguL1P`).once('value').then(snapshot => {
        const MinKondisi1L1P = snapshot.val();
    if(MinKondisi1L1P && currentDay === MinKondisi1L1P.MdayL1P && currentTime === MinKondisi1L1P.time){
        controlLED("Lateral1","L1P");
    }else{
        controlLED("Lateral1","OFF");
    }
    })
}

// Cek Waktu L2A
function Lateral2A(){
    // Hari dan jam
    const currentTime = new Date().toTimeString().slice(0, 5);
    const currentDay = new Date().getDay();
    
    // Senin
    firebase.database().ref(`DataWaktuL2A/SeninL2A`).once('value').then(snapshot => {
        const SenKondisi1L2A = snapshot.val();
    if(SenKondisi1L2A && currentDay === SenKondisi1L2A.SndayL2A && currentTime === SenKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Selasa
    firebase.database().ref(`DataWaktuL2A/SelasaL2A`).once('value').then(snapshot => {
        const SelKondisi1L2A = snapshot.val();
    if(SelKondisi1L2A && currentDay === SelKondisi1L2A.SdayL2A && currentTime === SelKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Rabu
    firebase.database().ref(`DataWaktuL2A/RabuL2A`).once('value').then(snapshot => {
        const RabKondisi1L2A = snapshot.val();
    if(RabKondisi1L2A && currentDay === RabKondisi1L2A.RdayL2A && currentTime === RabKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Kamis
    firebase.database().ref(`DataWaktuL2A/KamisL2A`).once('value').then(snapshot => {
        const KamKondisi1L2A = snapshot.val();
    if(KamKondisi1L2A && currentDay === KamKondisi1L2A.KdayL2A && currentTime === KamKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Jumat
    firebase.database().ref(`DataWaktuL2A/JumatL2A`).once('value').then(snapshot => {
        const JumKondisi1L2A = snapshot.val();
    if(JumKondisi1L2A && currentDay === JumKondisi1L2A.JdayL2A && currentTime === JumKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Sabtu
    firebase.database().ref(`DataWaktuL2A/SabtuL2A`).once('value').then(snapshot => {
        const SabKondisi1L2A = snapshot.val();
    if(SabKondisi1L2A && currentDay === SabKondisi1L2A.SbdayL2A && currentTime === SabKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Minggu
    firebase.database().ref(`DataWaktuL2A/MingguL2A`).once('value').then(snapshot => {
        const MinKondisi1L2A = snapshot.val();
    if(MinKondisi1L2A && currentDay === MinKondisi1L2A.MdayL2A && currentTime === MinKondisi1L2A.time){
        controlLED("Lateral2","L2A");
    }else{
        controlLED("Lateral2","OFF");
    }
    })
}

// Cek Waktu L2P
function Lateral2P(){
    // Hari dan jam
    const currentTime = new Date().toTimeString().slice(0, 5);
    const currentDay = new Date().getDay();
    
    // Senin
    firebase.database().ref(`DataWaktuL2P/SeninL2P`).once('value').then(snapshot => {
        const SenKondisi1L2P = snapshot.val();
    if(SenKondisi1L2P && currentDay === SenKondisi1L2P.SndayL2P && currentTime === SenKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Selasa
    firebase.database().ref(`DataWaktuL2P/SelasaL2P`).once('value').then(snapshot => {
        const SelKondisi1L2P = snapshot.val();
    if(SelKondisi1L2P && currentDay === SelKondisi1L2P.SdayL2P && currentTime === SelKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Rabu
    firebase.database().ref(`DataWaktuL2P/RabuL2P`).once('value').then(snapshot => {
        const RabKondisi1L2P = snapshot.val();
    if(RabKondisi1L2P && currentDay === RabKondisi1L2P.RdayL2P && currentTime === RabKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Kamis
    firebase.database().ref(`DataWaktuL2P/KamisL2P`).once('value').then(snapshot => {
        const KamKondisi1L2P = snapshot.val();
    if(KamKondisi1L2P && currentDay === KamKondisi1L2P.KdayL2P && currentTime === KamKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Jumat
    firebase.database().ref(`DataWaktuL2P/JumatL2P`).once('value').then(snapshot => {
        const JumKondisi1L2P = snapshot.val();
    if(JumKondisi1L2P && currentDay === JumKondisi1L2P.JdayL2P && currentTime === JumKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Sabtu
    firebase.database().ref(`DataWaktuL2P/SabtuL2P`).once('value').then(snapshot => {
        const SabKondisi1L2P = snapshot.val();
    if(SabKondisi1L2P && currentDay === SabKondisi1L2P.SbdayL2P && currentTime === SabKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })

    // Minggu
    firebase.database().ref(`DataWaktuL2P/MingguL2P`).once('value').then(snapshot => {
        const MinKondisi1L2P = snapshot.val();
    if(MinKondisi1L2P && currentDay === MinKondisi1L2P.MdayL2P && currentTime === MinKondisi1L2P.time){
        controlLED("Lateral2","L2P");
    }else{
        controlLED("Lateral2","OFF");
    }
    })
}

setInterval(Lateral1A, 1000)
setInterval(Lateral1P, 1000)
setInterval(Lateral2A, 1000)
setInterval(Lateral2P, 1000)