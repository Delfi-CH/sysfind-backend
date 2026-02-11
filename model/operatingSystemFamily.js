const operatingSystemFamilies = Object.freeze({
    PCDOS: 'PC-DOS',
    Windows9x: 'Windows 9x',
    WindowsNT: 'Windows NT',
    ClassicMacOS: 'Classic MacOS',
    MacOSX: 'MacOSX',
    UNIX: 'UNIX',
    UNIXLike: 'UNIX-Like',
    BSD: 'BSD',
    Linux: 'Linux',
    Other: 'Other',
})

function isValidOperatingSystemFamily(val) {
    return Object.values(operatingSystemFamilies).includes(val) ? val : operatingSystemFamilies.Other ;
}

module.exports = {operatingSystemFamilies, isValidOperatingSystemFamily}