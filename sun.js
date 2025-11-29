function getLocation() {
    navigator.geolocation.getCurrentPosition(success, error);
}

function error() {
    alert("Cannot get location. Please enable GPS.");
}



function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    document.getElementById("lat").innerText = lat.toFixed(4);
    document.getElementById("lon").innerText = lon.toFixed(4);

    calculateSun(lat, lon);
}


function calculateSun(lat, lon) {
    const now = new Date();
    const day = getDayOfYear(now);

    // Solar Declination
    const decl = 23.45 * Math.sin((360 / 365) * (day - 81) * Math.PI / 180);

    // Solar Time Angle (Hour Angle)
    const hour = now.getHours() + now.getMinutes() / 60;
    const hourAngle = 15 * (hour - 12);

    // Convert to radians
    const latRad = lat * Math.PI / 180;
    const declRad = decl * Math.PI / 180;
    const hrRad = hourAngle * Math.PI / 180;

    // Elevation calculation
    const elevation = Math.asin(
        Math.sin(latRad) * Math.sin(declRad) +
        Math.cos(latRad) * Math.cos(declRad) * Math.cos(hrRad)
    ) * 180 / Math.PI;

    // Azimuth
    const azimuth = Math.acos(
        (Math.sin(declRad) - Math.sin(latRad) * Math.sin(elevation * Math.PI / 180)) /
        (Math.cos(latRad) * Math.cos(elevation * Math.PI / 180))
    ) * 180 / Math.PI;

    document.getElementById("elevation").innerText = elevation.toFixed(2);
    document.getElementById("azimuth").innerText = azimuth.toFixed(2);

    calculateSunriseSunset(lat, decl);
}

function calculateSunriseSunset(lat, decl) {

    const latRad = lat * Math.PI / 180;
    const declRad = decl * Math.PI / 180;

    const H = Math.acos(-Math.tan(latRad) * Math.tan(declRad));

    const sunrise = 12 - (H * 180 / Math.PI) / 15;
    const sunset = 12 + (H * 180 / Math.PI) / 15;

    document.getElementById("sunrise").innerText = convertToTime(sunrise);
    document.getElementById("sunset").innerText = convertToTime(sunset);
}

function convertToTime(decimal) {
    const h = Math.floor(decimal);
    const m = Math.round((decimal - h) * 60);
    return `${h}:${m < 10 ? '0' + m : m}`;
}