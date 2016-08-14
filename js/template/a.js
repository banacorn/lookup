System.register(["../fmt"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var F;
    var simpleCodeName;
    // https://en.wiktionary.org/wiki/Template:accent
    // {{a|US|Canada}}
    function a(word, named, unnamed) {
        var complexCodeName = {
            "cot-caught": [F.seg("cot", true), F.seg("–"), F.seg("caught", true), F.seg(" merger")],
            "caught-cot": [F.seg("cot", true), F.seg("–"), F.seg("caught", true), F.seg(" merger")],
            "distinción": [F.seg("z", true), F.seg("–"), F.seg("s", true), F.seg(" distinction")],
            "father-bother": [F.seg("father", true), F.seg("–"), F.seg("bother", true), F.seg(" merger")],
            "lleísmo": [F.seg("ll", true), F.seg("–"), F.seg("y", true), F.seg(" distinction")],
            "Mary-marry-merry": [F.seg("Mary", true), F.seg("–"), F.seg("marry", true), F.seg("–"), F.seg("merry", true), F.seg(" merger")],
            "Mmmm": [F.seg("Mary", true), F.seg("–"), F.seg("marry", true), F.seg("–"), F.seg("merry", true), F.seg(" merger")],
            "non-Mary-marry-merry": [F.seg("Mary", true), F.seg("–"), F.seg("marry", true), F.seg("–"), F.seg("merry", true), F.seg(" distinction")],
            "nMmmm": [F.seg("Mary", true), F.seg("–"), F.seg("marry", true), F.seg("–"), F.seg("merry", true), F.seg(" distinction")],
            "pin-pen": [F.seg("pin", true), F.seg("–"), F.seg("pen", true), F.seg(" merger")],
            "pen-pin": [F.seg("pin", true), F.seg("–"), F.seg("pen", true), F.seg(" merger")],
            "seseo": [F.seg("seseo", true), F.seg(" merger")],
            "yeísmo": [F.seg("ll", true), F.seg("–"), F.seg("y", true), F.seg(" neutralization")]
        };
        var result = [F.seg("(")];
        // places
        unnamed.forEach(function (place, i) {
            var key = F.extractText(place);
            var simpleValue = simpleCodeName[key];
            var complexValue = complexCodeName[key];
            if (i !== 0)
                result = F.add(result, ", ");
            if (simpleValue)
                result = F.add(result, "" + simpleValue);
            else if (complexValue)
                result = F.concat(result, complexValue);
            else
                result = F.add(result, "" + key);
        });
        result = F.add(result, ")");
        return result;
    }
    return {
        setters:[
            function (F_1) {
                F = F_1;
            }],
        execute: function() {
            simpleCodeName = {
                "Anglicized": "Anglicised",
                "ar-Cairene": "Cairene",
                "Ashkenazi": "Ashkenazi Hebrew",
                "AU": "Australia",
                "Aus": "Australia",
                "AusE": "Australia",
                "BE-nl": "Belgium",
                "BE": "Belgium",
                "Bos": "Boston",
                "BP": "Brazil",
                "BR": "Brazil",
                "Brazilian Portuguese": "Brazil",
                "CA": "Canada",
                "Canadian": "Canada",
                "Canadian Shift": "Canadian Vowel Shift",
                "Canadian shift": "Canadian Vowel Shift",
                "Canadian vowel shift": "Canadian Vowel Shift",
                "RJ": "Carioca",
                "Spain": "Castilian",
                "Central Catalan": "Central",
                "central German": "central Germany",
                "Central German": "central Germany",
                "Central Germany": "central Germany",
                "Classical Sanskrit": "Classical",
                "cy-N": "North Wales",
                "cy-g": "North Wales",
                "cy-S": "South Wales",
                "cy-h": "South Wales",
                "Delhi": "Delhi Hindi",
                "FV": "French Flanders",
                "hbo": "Biblical Hebrew",
                "horse-hoarse": "without the horse–hoarse merger",
                "hy-E": "Eastern Armenian",
                "hy-IR": "Eastern Armenian - Iran",
                "hy-W": "Western Armenian",
                "hy-Y": "Eastern Armenian - Yerevan",
                "IL": "Modern Israeli Hebrew",
                "Israeli Hebrew": "Modern Israeli Hebrew",
                "Modern Hebrew": "Modern Israeli Hebrew",
                "Modern Israeli": "Modern Israeli Hebrew",
                "Modern/Israeli Hebrew": "Modern Israeli Hebrew",
                "InE": "Indian English",
                "IR": "Iranian Persian",
                "HE": "Ireland",
                "IE": "Ireland",
                "ps-Kandahar": "Kandahar",
                "Midwest US": "Midwestern US",
                "Midwest US English": "Midwestern US",
                "Midwestern US English": "Midwestern US",
                "Mizrahi": "Mizrahi Hebrew",
                "Mizrakhi": "Mizrahi Hebrew",
                "Mizrachi": "Mizrahi Hebrew",
                "Mizrakhi Hebrew": "Mizrahi Hebrew",
                "Mizrachi Hebrew": "Mizrahi Hebrew",
                "NL": "Netherlands",
                "New York": "NYC",
                "NY": "NYC",
                "NZ": "New Zealand",
                "nonrhotic": "non-rhotic",
                "northern and central Germany": "northern Germany, central Germany",
                "north and central German": "northern Germany, central Germany",
                "North and Central German": "northern Germany, central Germany",
                "north and central Germany": "northern Germany, central Germany",
                "North and Central Germany": "northern Germany, central Germany",
                "northern and central German": "northern Germany, central Germany",
                "Northern and Central German": "northern Germany, central Germany",
                "Northern and Central Germany": "northern Germany, central Germany",
                "North England": "Northern England",
                "north German": "northern Germany",
                "North German": "northern Germany",
                "north Germany": "northern Germany",
                "North Germany": "northern Germany",
                "northern German": "northern Germany",
                "Northern German": "northern Germany",
                "Northern Germany": "northern Germany",
                "Philippines": "Philippine",
                "EP": "Portugal",
                "PT": "Portugal",
                "ps-Kabul": "Kabuli",
                "Sephardi": "Sephardi Hebrew",
                "SAE": "South Africa",
                "south German": "southern Germany",
                "South German": "southern Germany",
                "south Germany": "southern Germany",
                "South Germany": "southern Germany",
                "southern German": "southern Germany",
                "Southern German": "southern Germany",
                "Southern Germany": "southern Germany",
                "St. Louis": "St. Louis (Missouri)",
                "STL": "St. Louis (Missouri)",
                "Standard": "standard",
                "Tajiki": "Tajik",
                "Tiberian": "Tiberian Hebrew",
                "British": "UK",
                "Vedic Sanskrit": "Vedic",
                "Rigvedic": "Vedic",
                "Welsh": "Wales"
            };
            exports_1("default",a);
        }
    }
});
